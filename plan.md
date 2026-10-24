# Rencana implementasi — Audio Visualizer Studio

## Hasil yang dituju

Produk dibuat sebagai dua program offline: APK Android dan aplikasi desktop portable Windows 7 SP1 32-bit (x86), yang dibuka sebagai alat seperti Audacity/VSDC, bukan situs yang bergantung pada browser luar. Impor audio, preview, pengaturan efek/lirik, proyek lokal, dan ekspor berjalan di perangkat tanpa unggah ke server.

Android menggunakan starter Expo SDK 57, React Native dan WebView lokal; konfigurasi native menetapkan `minSdkVersion: 24`, dengan ABI `armeabi-v7a` dan `arm64-v8a` agar perangkat Android 7.1.2 menjadi target instalasi. File hasil ditulis potongan demi potongan ke dokumen privat aplikasi dengan nama unik, lalu dibagikan melalui share sheet Android; aplikasi tidak meminta izin storage luas.

Desktop memakai Electron 22.3.27 ia32 dan menghasilkan executable portable. Electron 22 adalah lini terakhir yang secara resmi mendukung Windows 7 dan sudah tidak menerima perbaikan keamanan reguler. Karena itu semua fitur utama tetap offline, navigasi remote diblokir, IPC dibatasi ke dokumen lokal tepercaya dan aplikasi tidak memuat halaman dari internet. Gunakan hanya file media tepercaya.

## Ruang lingkup fitur

Visualizer menyediakan sembilan bentuk EQ (bars, mirror, wave, radial, spectrum, orbit, dots, pulse, ribbon) dan dua belas skin partikel (aurora, nebula, rain, orbit, firefly, comet, dust, sparks, snow, rings, embers, off). Warna utama/kedua, ukuran elemen, intensitas, jumlah partikel, dan preset performa low/balanced/high dapat diatur; mode Hemat menjadi default awal untuk target lama.

Pemutar memilih audio lokal, membaca metadata/durasi, menampilkan playhead dan preview reaktif. Studio lirik menerima teks per baris, timestamp yang bisa diedit, font sistem dan font TTF/OTF/WOFF/WOFF2 lokal, ukuran, fill, posisi, dan stroke. Sinkronisasi otomatis memakai analisis onset/envelope audio di perangkat untuk file sampai 20 MB dan durasi lima menit agar decoding PCM tidak menghabiskan RAM berlebih. Untuk trek di atas batas atau saat analisis waveform tidak tersedia, cue dibagi menurut durasi dan hasilnya bisa diperbaiki manual. Ini bukan pengenalan kata/vokal.

Ekspor menawarkan komposisi 16:9 YouTube, 9:16 Shorts/Reels, dan 1:1, dengan resolusi 720p/1080p serta 24/30 fps. Android merekam format yang didukung WebView/perangkat; audio video mengikuti codec runtime, sementara master tersimpan bit-for-bit secara terpisah tanpa mengubah sumber. Desktop merekam video secara bertahap dan memakai FFmpeg x86 untuk MP4 H.264; audio sumber disalin tanpa re-encode bila cocok dengan MP4. Jika tidak cocok, pengguna harus mengizinkan AAC 320 kbps; tanpa izin itu, hasil WebM dipertahankan. Tombol Master juga menyalin file audio asli tepat apa adanya. Platform sosial dapat meng-encode ulang file unggahan, sehingga kualitas bit-perfect setelah unggah tidak bisa dijamin oleh aplikasi lokal.

## Pendekatan teknis dan build

`visualizer/index.html` mengandung UI, Web Audio, Canvas, lirik, dan perekaman. HTML disalin menjadi `lib/visualizer-html.ts` untuk WebView Android dan pratinjau web. `lib/native-file-transfer.ts` menangani penulisan file lokal bertahap, validasi pesan, pencegahan overwrite dan berbagi file melalui Expo FileSystem/Sharing.

`desktop/main.cjs` mengelola dialog file, IPC ekspor chunk, mux/encode FFmpeg dan salinan master. `desktop/preload.cjs` memberi renderer API IPC terbatas; handler mengikat IPC ke frame lokal yang diizinkan. Navigasi di Android dan desktop dibatasi pada aset aplikasi; bridge Android memvalidasi URL, skema pesan, nama file, MIME dan ukuran chunk. Desktop memakai staging output agar kegagalan MP4 tidak menghapus hasil lama. `desktop/electron-builder.yml` menyertakan visualizer, ikon, dan encoder offline. Request HTTP/WS diblokir.

Ikon launcher dibuat untuk Android dan Windows. Build Android APK dilakukan melalui Dashboard menggunakan profil EAS `preview` (`distribution: internal`, `android.buildType: apk`) setelah source masuk checkpoint; jangan mengklaim APK sebelum build menghasilkan artefak. Build desktop portable Windows x86 memakai perintah `pnpm pack:win32` dari direktori `desktop/`. Build Linux memverifikasi packaging, tetapi belum membuktikan instalasi/run di mesin Windows 7 fisik. Kelancaran di RAM 3 GB ditargetkan melalui mode Hemat sebagai default awal dan ekspor chunked; uji pada perangkat fisik tetap diperlukan untuk mengonfirmasi performa akhir.

## Struktur proyek

- `app/`: route Expo dan host WebView fullscreen untuk APK; `index.web.tsx` menampilkan renderer pada preview web.
- `lib/native-file-transfer.ts`: bridge Android untuk menulis chunk, menyimpan di area privat aplikasi, lalu memanggil share sheet.
- `lib/visualizer-html.ts`: bundle HTML otomatis yang dipakai host WebView; dibuat oleh skrip sinkronisasi.
- `visualizer/index.html`: UI bersama, kontrol EQ/partikel, lirik, pemutar audio, preview dan ekspor.
- `desktop/main.cjs`, `preload.cjs`, `electron-builder.yml`: shell offline Electron, IPC berizin terbatas, FFmpeg dan packaging x86.
- `desktop/assets/`, `assets/images/`: ikon portable Windows dan ikon launcher Android.
- `scripts/`: bundling renderer dan generasi ikon.
- `docs/`: sumber riset teknis dan batas perilaku media.

## Arah desain

Tiga arah: (0,071) studio audio gelap dengan aksen cyan; (0,043) panel editorial terang dengan spektrum sebagai aksen; (0,018) retro-futuristik ungu-magenta dengan panel kaca. Arah dipilih: studio audio modern yang gelap dan presisi.

**Gerakan desain:** mixing-console kontemporer. **Prinsip inti:** kontrol utama mudah ditemukan; preview menjadi fokus; detail lanjutan tertata dalam panel tab; animasi ringan mengikuti preset daya. **Warna:** arang memberi kontras pada gelombang; cyan menandai audio aktif; biru mendukung kontrol sekunder. **Tata letak:** desktop memisahkan kanvas preview dan rail kontrol; ponsel menyusun preview, transport, lalu panel tab vertikal. **Motif khas:** garis spektrum, indikator playhead/waktu, dan halo warna hemat saat trek berjalan.

**Interaksi dan animasi:** kontrol merespons langsung; transisi panel singkat; preset hemat menekan frame rate, glow, dan jumlah partikel. **Tipografi:** Arial/Segoe UI dan fallback sistem; timestamp monospace; font lirik bisa dipilih/upload lokal. **Esensi merek:** studio visualizer untuk kreator yang menyusun visual musik dari ponsel atau PC; fokus, ekspresif, praktis. **Nada:** jelas dan langsung; “Pilih trek. Bentuk visualnya.” dan “Atur penanda lirik agar pas dengan musik.” **Ikon:** simbol EQ tanpa teks kecil. **Warna khas:** cyan elektrik di atas arang pekat.

## Rujukan teknis

- Expo FileSystem SDK 57: https://docs.expo.dev/versions/v57.0.0/sdk/filesystem/
- Expo Sharing SDK 57: https://docs.expo.dev/versions/v57.0.0/sdk/sharing/
- Expo build APK: https://docs.expo.dev/build-reference/apk/
- MediaRecorder format detection: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static
- Electron 22 Windows 7 lifecycle: https://electronjs.org/blog/windows-7-to-8-1-deprecation-notice
- electron-builder Windows architectures: https://www.electron.build/docs/architecture/
- FFmpeg installer Windows x86 package/license: https://www.npmjs.com/package/@ffmpeg-installer/win32-ia32
