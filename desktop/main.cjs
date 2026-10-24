const { app, BrowserWindow, dialog, ipcMain, session, shell } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');
const { spawn } = require('child_process');

let mainWindow;
let exportStream;
let exportTempPath;
let exportTargetPath;

function visualizerPath() {
  if (app.isPackaged) return path.join(process.resourcesPath, 'visualizer', 'index.html');
  return path.join(__dirname, '..', 'visualizer', 'index.html');
}

function isTrustedRenderer(event) {
  if (!mainWindow || event.sender !== mainWindow.webContents) return false;
  const frame = event.senderFrame;
  if (frame && event.sender.mainFrame && frame !== event.sender.mainFrame) return false;
  const url = frame && typeof frame.url === 'string' ? frame.url : event.sender.getURL();
  return url === pathToFileURL(visualizerPath()).href;
}

function requireTrustedRenderer(event) {
  if (!isTrustedRenderer(event)) throw new Error('Permintaan dari renderer yang tidak diizinkan.');
}

function ffmpegPath() {
  const root = app.isPackaged ? process.resourcesPath : __dirname;
  const candidates = [
    path.join(root, 'ffmpeg', 'ffmpeg.exe'),
    path.join(__dirname, 'node_modules', '@ffmpeg-installer', 'win32-ia32', 'ffmpeg.exe'),
  ];
  for (const candidate of candidates) if (fs.existsSync(candidate)) return candidate;
  return null;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 900,
    minWidth: 920,
    minHeight: 640,
    backgroundColor: '#080b10',
    title: 'Audio Visualizer Studio',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });
  mainWindow.loadFile(visualizerPath());
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url !== pathToFileURL(visualizerPath()).href) event.preventDefault();
  });
  mainWindow.webContents.on('will-attach-webview', (event) => event.preventDefault());
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const blocked = /^https?:|^ws:|^wss:/i.test(details.url);
    callback({ cancel: blocked });
  });
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('web-contents-created', (_event, contents) => {
  contents.on('will-navigate', (event, url) => { if (url !== pathToFileURL(visualizerPath()).href) event.preventDefault(); });
  contents.setWindowOpenHandler(() => ({ action: 'deny' }));
});

ipcMain.handle('audio-viz:begin-export', async (event, fileName) => {
  requireTrustedRenderer(event);
  const baseName = String(fileName || 'audio-visualizer.mp4').replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').slice(0, 120);
  const chosen = await dialog.showSaveDialog(mainWindow, {
    title: 'Simpan video visualizer',
    defaultPath: path.join(app.getPath('videos'), baseName),
    filters: [{ name: 'Video MP4', extensions: ['mp4'] }, { name: 'Semua file', extensions: ['*'] }],
  });
  if (chosen.canceled || !chosen.filePath) return { ok: false, canceled: true };
  if (exportStream) {
    try { exportStream.destroy(); } catch (_) {}
  }
  exportTargetPath = chosen.filePath;
  exportTempPath = path.join(os.tmpdir(), `audioviz-${Date.now()}-${Math.random().toString(16).slice(2)}.webm`);
  exportStream = fs.createWriteStream(exportTempPath, { flags: 'w' });
  await new Promise((resolve, reject) => {
    exportStream.once('open', resolve);
    exportStream.once('error', reject);
  });
  return { ok: true };
});

ipcMain.handle('audio-viz:append-export', async (event, chunk) => {
  requireTrustedRenderer(event);
  if (!exportStream) return { ok: false, message: 'Sesi ekspor belum dibuka.' };
  if (!(chunk instanceof ArrayBuffer) && !ArrayBuffer.isView(chunk)) return { ok: false, message: 'Potongan ekspor tidak valid.' };
  if (chunk.byteLength > 2 * 1024 * 1024) return { ok: false, message: 'Potongan ekspor terlalu besar.' };
  const buffer = chunk instanceof ArrayBuffer
    ? Buffer.from(new Uint8Array(chunk))
    : Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
  if (!exportStream.write(buffer)) await new Promise((resolve) => exportStream.once('drain', resolve));
  return { ok: true };
});

function runFfmpeg(binary, args) {
  return new Promise((resolve) => {
    const child = spawn(binary, args, { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
    let errorText = '';
    child.stderr.on('data', (data) => { errorText = (errorText + data.toString()).slice(-6000); });
    child.on('error', (error) => resolve({ ok: false, errorText: error.message }));
    child.on('close', (code) => resolve({ ok: code === 0, code, errorText }));
  });
}

function uniquePath(filePath) {
  const extension = path.extname(filePath);
  const base = path.join(path.dirname(filePath), path.basename(filePath, extension));
  let candidate = filePath;
  let suffix = 2;
  while (fs.existsSync(candidate)) candidate = `${base}-${suffix++}${extension}`;
  return candidate;
}

ipcMain.handle('audio-viz:finish-export', async (event, options) => {
  requireTrustedRenderer(event);
  if (!options || typeof options !== 'object' || Array.isArray(options)) return { ok: false, message: 'Pengaturan ekspor tidak valid.' };
  if (options.audioPath !== undefined && (typeof options.audioPath !== 'string' || options.audioPath.length > 32768)) return { ok: false, message: 'Path audio tidak valid.' };
  if (options.allowAac !== undefined && typeof options.allowAac !== 'boolean') return { ok: false, message: 'Pilihan codec tidak valid.' };
  if (options.keepMaster !== undefined && typeof options.keepMaster !== 'boolean') return { ok: false, message: 'Pilihan master tidak valid.' };
  if (!exportStream || !exportTempPath || !exportTargetPath) return { ok: false, message: 'Data ekspor tidak lengkap.' };
  const tempPath = exportTempPath;
  const targetPath = exportTargetPath;
  const sourcePath = options && options.audioPath;
  const hasSource = !!(sourcePath && fs.existsSync(sourcePath));
  const allowAac = !!(options && options.allowAac);
  const keepMaster = !!(options && options.keepMaster);
  const stagingPath = path.join(
    path.dirname(targetPath),
    `${path.basename(targetPath, path.extname(targetPath))}.audioviz-${Date.now()}-${Math.random().toString(16).slice(2)}.tmp.mp4`,
  );
  await new Promise((resolve, reject) => exportStream.end((error) => error ? reject(error) : resolve()));
  exportStream = null;
  exportTempPath = null;
  exportTargetPath = null;

  if (hasSource && path.resolve(sourcePath).toLowerCase() === path.resolve(targetPath).toLowerCase()) {
    try { fs.unlinkSync(tempPath); } catch (_) {}
    return { ok: false, message: 'Lokasi keluaran sama dengan file audio sumber. Pilih nama file video yang berbeda.' };
  }

  const saveWebmFallback = (message) => {
    let fallbackPath = path.join(path.dirname(targetPath), path.basename(targetPath, path.extname(targetPath)) + '.webm');
    if (hasSource && path.resolve(fallbackPath).toLowerCase() === path.resolve(sourcePath).toLowerCase()) {
      fallbackPath = path.join(path.dirname(targetPath), path.basename(targetPath, path.extname(targetPath)) + '-visualizer-fallback.webm');
    }
    fallbackPath = uniquePath(fallbackPath);
    try {
      if (fs.existsSync(stagingPath)) fs.unlinkSync(stagingPath);
      fs.copyFileSync(tempPath, fallbackPath, fs.constants.COPYFILE_EXCL);
      fs.unlinkSync(tempPath);
      let masterPath = null;
      let masterSaved = false;
      if (keepMaster && hasSource) {
        masterPath = uniquePath(path.join(path.dirname(targetPath), `${path.basename(targetPath, path.extname(targetPath))}-audio-master${path.extname(sourcePath)}`));
        try { fs.copyFileSync(sourcePath, masterPath, fs.constants.COPYFILE_EXCL); masterSaved = true; } catch (_) { masterPath = null; }
      }
      return { ok: false, message, fallbackPath, masterPath, masterSaved };
    } catch (error) {
      return { ok: false, message, details: error.message };
    }
  };

  if (!hasSource && !allowAac) return saveWebmFallback('Audio sumber tidak tersedia untuk salin-stream. Aktifkan opsi AAC 320 kbps jika Anda mengizinkan encoding audio.');
  const ffmpeg = ffmpegPath();
  if (!ffmpeg) return saveWebmFallback('Encoder FFmpeg Windows x86 tidak ditemukan; video disimpan sebagai WebM.');

  const common = ['-y', '-i', tempPath];
  if (hasSource) common.push('-i', sourcePath);
  common.push('-map', '0:v:0');
  if (hasSource) common.push('-map', '1:a:0');
  else common.push('-map', '0:a:0?');
  common.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-shortest');
  common.push('-c:a', hasSource ? 'copy' : 'aac');
  if (!hasSource) common.push('-b:a', '320k');
  common.push(stagingPath);

  let result = await runFfmpeg(ffmpeg, common);
  let audioCopied = hasSource;
  if (!result.ok && hasSource && allowAac) {
    const fallback = common.slice();
    const codecIndex = fallback.lastIndexOf('copy');
    if (codecIndex >= 0) fallback.splice(codecIndex - 1, 2, '-c:a', 'aac', '-b:a', '320k');
    result = await runFfmpeg(ffmpeg, fallback);
    audioCopied = false;
  }
  if (result.ok) {
    let backupPath = null;
    try {
      if (fs.existsSync(targetPath)) {
        backupPath = `${targetPath}.audioviz-backup-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        await fs.promises.rename(targetPath, backupPath);
      }
      await fs.promises.rename(stagingPath, targetPath);
    } catch (error) {
      if (backupPath && fs.existsSync(backupPath) && !fs.existsSync(targetPath)) {
        try { await fs.promises.rename(backupPath, targetPath); } catch (_) {}
      }
      return saveWebmFallback(`MP4 gagal dipindahkan dengan aman ke lokasi akhir: ${error.message}`);
    }
    if (backupPath) { try { await fs.promises.unlink(backupPath); } catch (_) {} }
    try { fs.unlinkSync(tempPath); } catch (_) {}
    let masterPath = null;
    let masterSaved = false;
    if (keepMaster && hasSource) {
      const extension = path.extname(sourcePath);
      masterPath = uniquePath(path.join(path.dirname(targetPath), `${path.basename(targetPath, path.extname(targetPath))}-audio-master${extension}`));
      try { fs.copyFileSync(sourcePath, masterPath, fs.constants.COPYFILE_EXCL); masterSaved = true; } catch (_) { masterPath = null; }
    }
    return { ok: true, path: targetPath, audioCopied, masterPath, masterSaved };
  }
  return saveWebmFallback(allowAac ? 'Ekspor MP4 gagal. File WebM lokal dipertahankan.' : 'Audio sumber tidak dapat dimasukkan ke MP4 tanpa encoding ulang. File WebM disimpan; izinkan AAC secara eksplisit bila Anda setuju.');
});

ipcMain.handle('audio-viz:cancel-export', async (event) => {
  requireTrustedRenderer(event);
  if (exportStream) { try { exportStream.destroy(); } catch (_) {} }
  if (exportTempPath) { try { fs.unlinkSync(exportTempPath); } catch (_) {} }
  exportStream = null; exportTempPath = null; exportTargetPath = null;
  return { ok: true };
});

ipcMain.handle('audio-viz:show-file', async (event, filePath) => {
  requireTrustedRenderer(event);
  if (typeof filePath !== 'string' || !fs.existsSync(filePath)) return false;
  shell.showItemInFolder(filePath);
  return true;
});

ipcMain.handle('audio-viz:copy-original', async (event, sourcePath, fileName) => {
  requireTrustedRenderer(event);
  if (typeof sourcePath !== 'string' || !fs.existsSync(sourcePath)) return { ok: false };
  const safeName = path.basename(String(fileName || 'audio-master')).replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').slice(0, 140);
  const chosen = await dialog.showSaveDialog(mainWindow, {
    title: 'Simpan master audio asli',
    defaultPath: path.join(app.getPath('music'), safeName),
    filters: [{ name: 'File audio asli', extensions: [path.extname(safeName).slice(1) || '*'] }, { name: 'Semua file', extensions: ['*'] }],
  });
  if (chosen.canceled || !chosen.filePath) return { ok: false, canceled: true };
  try {
    await fs.promises.copyFile(sourcePath, chosen.filePath);
    return { ok: true, path: chosen.filePath };
  } catch (error) {
    return { ok: false, message: error.message };
  }
});
