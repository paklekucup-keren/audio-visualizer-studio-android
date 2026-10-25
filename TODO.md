# TODO — Audio Visualizer Studio

## APK offline Android dan target penggunaan
- [x] Buat source tools AUDIO VIDEO VISUALIZER untuk aplikasi Android native; fitur bekerja lokal pada renderer yang dibundel, tidak mengunggah audio ke server.
- [x] Targetkan HP Android versi 7.1.2 melalui `minSdkVersion: 24`, ABI ARM 32/64-bit, WebView aset lokal, penyimpanan bertahap, dan mode Hemat default untuk 18 fps/18 partikel.
- [x] Program harus tetap berfungsi untuk fitur inti tanpa koneksi internet; host Android membatasi navigasi ke aset app dan tidak meminta izin storage luas.
- [x] Siapkan profil build internal yang menghasilkan APK (`eas.json`, `preview.android.buildType: apk`) untuk build Dashboard setelah checkpoint source.
- [ ] Bangun dan serahkan file APK nyata melalui Dashboard; profil konfigurasi saja bukan artefak APK.
- [ ] Verifikasi APK pada perangkat Android 7.1.2 RAM 3 GB untuk instalasi, penggunaan offline, pemilihan audio, ekspor video/share sheet, dan kelancaran.

## Program desktop offline Windows 7 32-bit
- [x] Sediakan program desktop/audio visualizer yang dibuka langsung sebagai alat seperti Audacity/VSDC, bukan hanya browser atau emulator Android; tersedia executable portable Windows x86.
- [ ] Uji langsung target Windows 7 SP1 32-bit RAM 3 GB; packaging x86 di Linux belum memverifikasi runtime fisik pada PC pengguna.
- [x] Tidak memerlukan akun, layanan cloud, atau koneksi internet untuk mengimpor audio, mengedit visual/lirik, memutar audio, menyimpan proyek JSON, dan menyiapkan keluaran lokal. Saat membuka proyek lagi, pengguna memilih ulang audio lokal.

## EQ Visualizer dan pengaturan tampilan
- [x] Sediakan EQ VISUALIZER dengan sembilan variasi: bars, mirror, wave, radial, spectrum, orbit, dots, pulse, ribbon.
- [x] Sediakan pengaturan warna utama/kedua dan ukuran visualizer/elemen.
- [x] Preview audio dan visual bergerak dengan pilihan performa Hemat/Seimbang/Detail.

## Particle System Visualizer dan skin
- [x] Sediakan Particle System Visualizer dan 12 skin/varian: aurora, nebula, rain, orbit, firefly, comet, dust, sparks, snow, rings, embers, off.
- [x] Sediakan pengaturan warna, ukuran, jumlah/intensitas partikel, serta pembatas mode hemat.

## Teks dan sinkronisasi lirik
- [x] Untuk teks lirik, bisa edit jenis huruf: font sistem yang dibundel dan file lokal TTF/OTF/WOFF/WOFF2; font unggahan bersifat sesi aktif dan tidak tertanam di proyek.
- [x] Sediakan pengaturan ukuran font dan warna fill huruf, posisi, dan outline.
- [x] Baca durasi audio otomatis dan sediakan sinkronisasi lirik dengan audio yang diinput melalui analisis dinamika/onset lokal untuk audio sampai 20 MB dan lima menit; ini bukan pengenalan kata/vokal.
- [x] Untuk file di atas batas analisis atau waveform yang gagal, cue dibagi menurut durasi; sediakan penyuntingan timestamp agar hasil sinkronisasi dapat diperbaiki manual.

## Ekspor video dan kualitas audio
- [x] Sediakan pilihan output untuk unggahan seperti YouTube maupun sosial media tanpa server upload.
- [x] Sediakan format komposisi umum: landscape 16:9 (YouTube), portrait 9:16 (Shorts/Reels), dan square 1:1, dengan 720p/1080p serta 24/30 fps.
- [x] Pertahankan bitstream audio sumber bila desktop dapat menyalinnya tanpa re-encode; jangan menurunkan kualitas diam-diam. Codec runtime ditampilkan, AAC 320 kbps desktop memerlukan persetujuan eksplisit, dan audio video Android mengikuti codec WebView/perangkat.
- [x] Sediakan opsi salinan master audio tanpa perubahan; berkas sumber tidak dimodifikasi. Platform sosial tetap dapat meng-encode ulang unggahan setelah diekspor.

## Antarmuka, referensi, dan kelancaran
- [x] Tampilan UI dibuat menarik, profesional, dan mencakup panel efek, lirik, pemutar, proyek, performa, serta ekspor.
- [ ] Bandingkan langsung jumlah/variasi dengan contoh yang dimaksud pengguna; contoh tersebut belum dilampirkan. Implementasi saat ini menyediakan 9 variasi EQ dan 12 skin partikel.
- [ ] Pastikan kelancaran di HP Android 7.1.2 RAM 3 dan PC Windows 7 32-bit RAM 3 melalui pengujian langsung perangkat; mode hemat telah tersedia, tetapi belum diuji pada perangkat target.
- [ ] Buat repository GitHub private berisi source aplikasi Android dan Workflow GitHub Actions yang membangun APK installable; terbitkan APK pada GitHub Releases agar dapat diunduh pengguna. Repository utama Mobile tetap Manus-managed.
- [ ] Setelah APK dibangun dan hasil implementasi final siap, beritahu pengguna melalui percakapan ini serta jelaskan hasil pengujian/perangkat fisik yang masih diperlukan.
