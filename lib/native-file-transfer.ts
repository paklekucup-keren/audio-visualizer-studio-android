import { File, FileMode, Paths } from "expo-file-system";
import type { FileHandle } from "expo-file-system";
import * as Sharing from "expo-sharing";

type FileAction = "file-start" | "file-chunk" | "file-finish" | "file-abort";
type FileMessage = {
  action: FileAction;
  requestId: string;
  transferId: string;
  name?: string;
  mimeType?: string;
  chunk?: string;
};
type FileReply = { requestId: string; ok: boolean; message?: string };
type ActiveTransfer = {
  id: string;
  file: File;
  handle: FileHandle;
  mimeType: string;
};

let activeTransfer: ActiveTransfer | null = null;
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const allowedActions: FileAction[] = ["file-start", "file-chunk", "file-finish", "file-abort"];
const maxMessageChars = 220_000;
const maxChunkChars = 180_000;

function decodeBase64(input: string): Uint8Array {
  const output = new Uint8Array(Math.floor((input.length * 3) / 4));
  let accumulator = 0;
  let bits = 0;
  let offset = 0;
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (char === "=") break;
    const value = alphabet.indexOf(char);
    if (value < 0) throw new Error("Potongan base64 tidak valid.");
    accumulator = (accumulator << 6) | value;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output[offset] = (accumulator >> bits) & 0xff;
      offset += 1;
      accumulator &= (1 << bits) - 1;
    }
  }
  return output.subarray(0, offset);
}

function safeFileName(name: string | undefined): string {
  const cleaned = (name || "audio-visualizer-output.bin")
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_")
    .replace(/^\.+/, "")
    .slice(0, 140);
  return cleaned || "audio-visualizer-output.bin";
}

function uniqueDocumentFile(name: string): File {
  const safeName = safeFileName(name);
  const dot = safeName.lastIndexOf(".");
  const base = dot > 0 ? safeName.slice(0, dot) : safeName;
  const extension = dot > 0 ? safeName.slice(dot) : "";
  let file = new File(Paths.document, safeName);
  let suffix = 2;
  while (file.exists) {
    file = new File(Paths.document, `${base}-${suffix}${extension}`);
    suffix += 1;
  }
  return file;
}

function isMimeType(value: unknown): value is string {
  return typeof value === "string" && value.length <= 128 && /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i.test(value);
}

export async function handleNativeFileMessage(
  rawData: string,
  respond: (reply: FileReply) => void,
): Promise<boolean> {
  if (typeof rawData !== "string" || rawData.length > maxMessageChars) return false;
  let input: unknown;
  try {
    input = JSON.parse(rawData);
  } catch {
    return false;
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) return false;
  const candidate = input as Partial<FileMessage>;
  if (typeof candidate.requestId !== "string" || !/^av-\d+-[a-f0-9]+$/i.test(candidate.requestId)) return false;
  const reply = (ok: boolean, detail?: string) =>
    respond({ requestId: candidate.requestId!, ok, message: detail });
  if (
    typeof candidate.transferId !== "string" ||
    candidate.transferId.length > 80 ||
    !/^(?:file|video)-\d+-[a-f0-9]+$/i.test(candidate.transferId)
  ) {
    reply(false, "ID transfer tidak valid.");
    return true;
  }
  if (!allowedActions.includes(candidate.action as FileAction)) {
    reply(false, "Tindakan file tidak dikenal.");
    return true;
  }
  const message = candidate as FileMessage;

  try {
    if (message.action === "file-start") {
      if (activeTransfer) {
        reply(false, "Penyimpanan lain sedang berlangsung.");
        return true;
      }
      if (message.name !== undefined && (typeof message.name !== "string" || message.name.length > 300)) {
        reply(false, "Nama file tidak valid.");
        return true;
      }
      if (message.mimeType !== undefined && !isMimeType(message.mimeType)) {
        reply(false, "Jenis file tidak valid.");
        return true;
      }
      const file = uniqueDocumentFile(message.name || "audio-visualizer-output.bin");
      file.create({ intermediates: true, overwrite: false });
      const handle = file.open(FileMode.WriteOnly);
      activeTransfer = {
        id: message.transferId,
        file,
        handle,
        mimeType: message.mimeType || "application/octet-stream",
      };
      reply(true);
      return true;
    }

    if (!activeTransfer || activeTransfer.id !== message.transferId) {
      reply(false, "Sesi simpan file tidak ditemukan.");
      return true;
    }

    if (message.action === "file-chunk") {
      const chunk = message.chunk;
      if (
        typeof chunk !== "string" ||
        chunk.length === 0 ||
        chunk.length > maxChunkChars ||
        chunk.length % 4 !== 0 ||
        !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(chunk)
      ) {
        reply(false, "Potongan file tidak valid atau terlalu besar.");
        return true;
      }
      activeTransfer.handle.writeBytes(decodeBase64(chunk));
      reply(true);
      return true;
    }

    if (message.action === "file-abort") {
      const transfer = activeTransfer;
      activeTransfer = null;
      transfer.handle.close();
      transfer.file.delete();
      reply(true);
      return true;
    }

    if (message.action === "file-finish") {
      const transfer = activeTransfer;
      activeTransfer = null;
      transfer.handle.close();
      if (await Sharing.isAvailableAsync()) {
        try {
          await Sharing.shareAsync(transfer.file.uri, {
            dialogTitle: "Bagikan atau simpan hasil Audio Visualizer",
            mimeType: transfer.mimeType,
          });
          reply(true, "File tersimpan di dokumen aplikasi dan siap dibagikan.");
        } catch {
          reply(true, "File tetap tersimpan di dokumen aplikasi; share sheet ditutup tanpa memilih tujuan.");
        }
      } else {
        reply(true, "File tersimpan di dokumen aplikasi, tetapi share sheet tidak tersedia.");
      }
      return true;
    }
  } catch (error) {
    if (activeTransfer?.id === message.transferId) {
      const transfer = activeTransfer;
      activeTransfer = null;
      try { transfer.handle.close(); } catch { /* already closed */ }
      try { transfer.file.delete(); } catch { /* partial output cleanup */ }
    }
    reply(false, error instanceof Error ? error.message : "Gagal menyimpan file lokal.");
    return true;
  }
  return false;
}
