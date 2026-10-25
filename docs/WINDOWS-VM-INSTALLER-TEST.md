# Manual Pengujian Installer Windows di VM Lokal

Dokumen ini menjelaskan cara menguji `Audio-Visualizer-Studio-1.0.1-ia32.exe` pada Windows 7 SP1 32-bit atau Windows 10/11 32-bit di mesin virtual lokal. Pengujian dilakukan pada salinan VM yang dapat dikembalikan melalui snapshot/checkpoint.

## 1. Persiapan host

Gunakan salah satu hypervisor berikut:

- Hyper-V pada Windows Pro/Enterprise.
- VirtualBox pada Windows/Linux.
- VMware Workstation/Player.

Buat VM khusus pengujian dengan spesifikasi awal:

- 1–2 vCPU.
- RAM 3 GB untuk simulasi target.
- Disk dinamis minimal 32 GB.
- Windows 7 SP1 32-bit untuk target kompatibilitas asli, atau Windows 10/11 32-bit untuk smoke test modern.
- Snapshot/checkpoint bernama `clean-before-installer` setelah Windows, driver, dan runtime dasar selesai dipasang.

Jangan menguji pada VM kerja utama. Installer dapat membuat perubahan pada file dan registry guest.

## 2. Siapkan installer

Salin installer ke VM melalui shared folder, ISO, atau attachment virtual. Sebelum menjalankannya, cocokkan hash installer.

Hash file yang diaudit:

```text
003ac0387420fe44a8b2f4cd0a769dd988f20723b91d4f1d256ebe48051a9af6
```

Pada Windows PowerShell:

```powershell
Get-FileHash .\Audio-Visualizer-Studio-1.0.1-ia32.exe -Algorithm SHA256
```

Pada Command Prompt Windows 7:

```cmd
certutil -hashfile Audio-Visualizer-Studio-1.0.1-ia32.exe SHA256
```

Jangan lanjutkan apabila hasil hash berbeda.

## 3. Uji instalasi

1. Ambil snapshot/checkpoint baru dari `clean-before-installer`.
2. Putuskan jaringan VM atau gunakan firewall guest untuk memastikan aplikasi tetap offline. Installer ini ditujukan untuk penggunaan lokal.
3. Klik kanan installer dan pilih **Run as administrator** hanya jika Windows memerlukannya.
4. Catat nama, lokasi, dan opsi instalasi yang ditampilkan.
5. Selesaikan instalasi.
6. Catat exit code atau pesan error jika installer berhenti.
7. Pastikan shortcut atau executable utama tersedia.

Untuk pengujian NSIS tanpa UI, jika installer mendukung mode silent:

```cmd
Audio-Visualizer-Studio-1.0.1-ia32.exe /S
```

Gunakan mode UI terlebih dahulu untuk Windows 7 agar kegagalan instalasi lebih mudah diamati.

## 4. Smoke test startup

Setelah instalasi:

1. Jalankan aplikasi.
2. Pastikan jendela utama muncul tanpa splash screen yang macet.
3. Pastikan tidak ada dialog missing DLL, renderer crash, atau blank window.
4. Buka Task Manager dan amati penggunaan CPU/RAM selama 60 detik.
5. Tutup aplikasi, buka kembali, lalu catat apakah startup konsisten.
6. Periksa **Event Viewer → Windows Logs → Application** untuk error `Application Error`, `Windows Error Reporting`, atau crash Electron.

Aplikasi ini menggunakan Electron 22 dan target x86. Kegagalan pada Windows 7 dapat disebabkan oleh runtime OS, driver audio, atau keterbatasan Electron lama, bukan hanya installer.

## 5. Uji impor dan playback audio

Siapkan fixture WAV dan MP3 yang tidak dilindungi DRM.

1. Impor WAV PCM pendek sekitar 10–30 detik.
2. Impor MP3 dengan bitrate umum.
3. Tekan Play, Pause, Resume, dan Stop.
4. Pastikan waktu berjalan, durasi, dan status player berubah masuk akal.
5. Ulangi setelah menutup lalu membuka aplikasi kembali.
6. Uji audio tanpa perangkat output aktif jika VM mengizinkan.
7. Catat codec, pesan error, jeda, atau playback yang berhenti.

## 6. Uji visualizer dan proyek

1. Ganti seluruh preset EQ yang tersedia.
2. Ganti skin partikel dan opsi Off.
3. Ubah warna, ukuran, intensitas, kecepatan, dan mode performa.
4. Tambahkan judul/subteks dan lirik dengan timestamp.
5. Simpan proyek JSON ke folder lokal.
6. Tutup aplikasi dan buka proyek JSON tersebut.
7. Pastikan aplikasi meminta pemilihan ulang file audio jika audio lokal tidak tertanam.
8. Pastikan file audio sumber tidak berubah ukuran atau hash.

## 7. Uji ekspor

Uji satu kombinasi per kategori:

- Landscape 16:9, 720p, 24 fps.
- Portrait 9:16, 720p, 30 fps.
- Square 1:1, 1080p bila RAM VM mencukupi.

Untuk setiap ekspor:

1. Pilih nama output yang berbeda dari file audio sumber.
2. Pastikan progress atau status ekspor bergerak.
3. Pastikan file MP4 dapat dibuka oleh pemutar lokal.
4. Periksa durasi video dan audio dengan MediaInfo atau `ffprobe`.
5. Uji fallback WebM dengan audio source yang tidak tersedia atau codec yang tidak cocok.
6. Uji opsi AAC hanya setelah mencatat bahwa opsi tersebut meminta persetujuan eksplisit.
7. Pastikan file master audio, jika dipilih, identik dengan source melalui hash.
8. Uji pembatalan ekspor dan pastikan file temporary tidak tertinggal di `%TEMP%`.

Contoh pemeriksaan:

```cmd
ffprobe -v error -show_entries format=duration,format_name -of default=nw=1 output.mp4
```

## 8. Uji offline dan keamanan dasar

Dengan jaringan VM tetap diputus:

1. Startup aplikasi.
2. Impor audio.
3. Playback.
4. Edit visual/lirik.
5. Simpan/buka proyek.
6. Ekspor video.

Pastikan tidak ada fitur inti yang memerlukan login, upload, cloud API, atau koneksi internet. Jangan memasukkan file yang tidak tepercaya ke aplikasi saat pengujian.

## 9. Kriteria lulus minimum

Pengujian minimum dianggap lulus jika:

- Installer selesai tanpa error.
- Aplikasi startup dua kali berturut-turut.
- Tidak ada crash pada Event Viewer selama smoke test.
- WAV dan MP3 dapat diimpor dan diputar.
- Proyek dapat disimpan dan dibuka kembali.
- Minimal satu video MP4 berhasil dibuat dan diputar.
- Fallback WebM memberi pesan yang jelas ketika MP4 tidak dapat dibuat.
- Aplikasi tetap menjalankan fitur inti saat VM offline.
- Tidak ada perubahan pada file audio sumber.
- VM dapat dikembalikan ke checkpoint awal.

## 10. Laporan kegagalan

Untuk setiap bug, catat:

- Versi Windows dan arsitektur.
- RAM/vCPU VM.
- Hash installer.
- Langkah reproduksi.
- Hasil aktual dan hasil yang diharapkan.
- Nama file fixture dan hash-nya.
- Screenshot atau rekaman layar.
- Event Viewer error dan exit code.
- Folder `%TEMP%` yang relevan.
- Apakah bug dapat direproduksi setelah restore checkpoint.

Jangan memperbaiki file instalasi secara manual. Perbaikan harus dilakukan pada source `desktop/` atau `visualizer/`, kemudian build portable baru harus dibuat dan diuji ulang.

## Prioritas pemeriksaan dari audit source

1. **Ekspor dan cleanup temporary:** pastikan jalur sukses, gagal, dan cancel selalu membersihkan stream, temporary WebM, dan staging MP4.
2. **Fallback FFmpeg:** verifikasi pesan ketika FFmpeg x86 hilang, codec audio tidak kompatibel, atau target output tidak dapat dipindahkan.
3. **Kompatibilitas Windows 7:** verifikasi startup, audio output, dialog save, dan rendering pada target fisik/VM; build Linux hanya membuktikan packaging.
4. **Packaging metadata:** metadata `author` dan `repository` perlu tersedia agar hasil build/publish tidak lagi memberi warning metadata.
5. **Coverage E2E desktop:** tambahkan test untuk startup, import audio, playback, proyek JSON, ekspor MP4/WebM, dan cancel.
6. **Ketahanan resource:** uji audio panjang, gambar background besar, dan ekspor 1080p pada RAM 3 GB untuk mendeteksi tekanan memori.

Status setiap poin harus dibedakan antara **lulus di VM**, **lulus di sandbox build**, dan **belum diverifikasi pada perangkat target**.
