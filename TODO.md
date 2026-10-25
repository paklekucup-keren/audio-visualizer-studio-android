# TODO — Audio Visualizer Studio

## APK offline Android dan target penggunaan
- [x] Buat source tools AUDIO VIDEO VISUALIZER untuk aplikasi Android native; fitur bekerja lokal pada renderer yang dibundel, tidak mengunggah audio ke server.
- [x] Targetkan HP Android versi 7.1.2 melalui `minSdkVersion: 24`, ABI ARM 32/64-bit, WebView aset lokal, penyimpanan bertahap, dan mode Hemat default untuk 18 fps/18 partikel.
- [x] Program harus tetap berfungsi untuk fitur inti tanpa koneksi internet; host Android membatasi navigasi ke aset app dan tidak meminta izin storage luas.
- [x] Siapkan profil build internal yang menghasilkan APK (`eas.json`, `preview.android.buildType: apk`) untuk build Dashboard setelah checkpoint source.
- [x] Diagnosis gejala splash: workflow sebelumnya memakai `assembleDebug`; konfigurasi React Native menyatakan varian debug melewatkan bundling JavaScript/aset, sehingga APK tanpa Metro tidak dapat masuk ke UI.
- [x] Sediakan arsip ZIP v1.0.0 yang dapat diunduh lalu diekstrak di HP, berisi APK dan petunjuk pemasangan; setelah ekstraksi, ketuk APK (tidak mengekstrak isi APK). ZIP itu berisi build `assembleDebug` yang teridentifikasi sebagai penyebab macet dan harus digantikan.
- [x] Terbitkan pembaruan APK standalone Android v1.0.1 (`versionCode: 2`) dari Gradle `:app:assembleRelease` agar bundle JavaScript tertanam dan aplikasi dapat mulai offline tanpa Metro; unggah APK serta ZIP berisi APK dan petunjuk ke GitHub Release. Run `40195574929` sukses; APK berisi `assets/index.android.bundle`, ZIP valid dan memuat APK identik serta `PETUNJUK.txt`.
- [x] Terbitkan APK standalone v1.0.2 (`versionCode: 3`) dengan fitur visualizer dari video referensi; run `40206740511` sukses setelah 32 menit, APK berisi bundle JavaScript 3.875.000 byte, dan ZIP valid dengan APK identik serta `PETUNJUK.txt`.
- [x] Terbitkan v1.0.3 (`versionCode: 4`) dengan perbaikan responsif agar tombol Simpan proyek/Buka proyek terlihat pada ponsel; run `40209720636` sukses dalam 28 menit 3 detik. APK berisi bundle JS 3.876.404 byte dan ABI `armeabi-v7a`/`arm64-v8a`; ZIP valid dengan APK identik dan `PETUNJUK.txt`; screenshot Preview 390×844 dan 320×720 mengonfirmasi kontrol tidak terpotong.
- [x] Bangun dan rilis APK standalone v1.0.4 (`versionCode: 5`) dengan fallback pemutaran audio dan status error yang terlihat setelah checkpoint source; run `40215326444` sukses melalui `:app:assembleRelease`. APK memuat bundle JS 3.886.096 byte dan ABI `armeabi-v7a`/`arm64-v8a`; ZIP valid berisi APK identik byte demi byte dan `PETUNJUK.txt`.
- [x] Perbaiki jalur Play agar selalu memanggil `audio.play()` meski Web Audio/MediaStreamDestination gagal; fallback hubungkan sumber langsung ke output, kelola `AudioContext.resume()` tanpa unhandled rejection, dan tampilkan status memuat/siap/berjalan/jeda/selesai/error serta waktu berjalan di player. Matriks Chromium untuk WAV, MP3, destination gagal, AudioContext tidak tersedia/suspended, dan codec rusak lolos; perangkat Android target tetap belum diverifikasi.
- [ ] Verifikasi APK pada perangkat Android 7.1.2 RAM 3 GB untuk instalasi, penggunaan offline, pemilihan audio, ekspor video/share sheet, dan kelancaran.

## Program desktop offline Windows 7 32-bit
- [x] Sediakan program desktop/audio visualizer yang dibuka langsung sebagai alat seperti Audacity/VSDC, bukan hanya browser atau emulator Android; tersedia executable portable Windows x86.
- [ ] Uji langsung target Windows 7 SP1 32-bit RAM 3 GB; packaging x86 di Linux belum memverifikasi runtime fisik pada PC pengguna.
- [x] Tidak memerlukan akun, layanan cloud, atau koneksi internet untuk mengimpor audio, mengedit visual/lirik, memutar audio, menyimpan proyek JSON, dan menyiapkan keluaran lokal. Saat membuka proyek lagi, pengguna memilih ulang audio lokal.

## EQ Visualizer dan pengaturan tampilan
- [x] Sediakan EQ VISUALIZER dengan sepuluh pilihan: bars, mirror, wave, radial, spectrum, orbit, dots, pulse, ribbon, dan Lengkungan Kembar dari referensi video.
- [x] Sediakan pengaturan warna utama/kedua dan ukuran visualizer/elemen.
- [x] Preview audio dan visual bergerak dengan pilihan performa Hemat/Seimbang/Detail.

## Particle System Visualizer dan skin
- [x] Sediakan Particle System Visualizer dengan 12 skin aktif: aurora, nebula, rain, orbit, firefly, comet, dust, sparks, snow, rings, embers, dan bokeh; opsi tambahan Off, total 13 pilihan UI.
- [x] Sediakan pengaturan warna, ukuran, jumlah/intensitas partikel, serta pembatas mode hemat.

## Gaya video referensi, overlay dan gambar latar
- [x] Analisis video contoh dan sediakan preset “Lengkungan Kembar” dengan dua lengkungan simetris yang berdenyut mengikuti audio, komposisi fokus tengah, latar gelap, dan bokeh kecil bergerak pelan; overlay judul lagu/subteks, waktu berjalan/sisa, dan progress bar dapat diubah atau dimatikan. Judul diisi otomatis dari nama file audio lokal dan dapat diedit.
- [x] Tambahkan kontrol kecepatan animasi serta skala/ukuran visualizer; perubahan kecepatan mengatur gerak lengkungan, EQ, dan partikel.
- [x] Di viewport ponsel, tombol Simpan proyek dan Buka proyek tetap terlihat pada baris kedua header sehingga proyek bergambar latar dapat disimpan/dibuka tanpa tombol meluber.
- [x] Sediakan Particle Effect Overlay yang bisa diaktif/nonaktifkan, mengatur opacity, dan ditampilkan di atas latar.
- [x] Tambahkan EQ Effect Overlay dengan minimal tiga warna terpisah untuk low 40–250 Hz, medium 250–2.000 Hz, dan high 2.000–10.000 Hz; tiap warna menggerakkan layer frekuensi yang sesuai dan warnanya bisa diubah.
- [x] Sediakan input gambar lokal sebagai background dengan pilihan cover/contain dan penggelap latar; gambar diproses di perangkat, dibatasi 12 MB dan diperkecil sekali hingga sisi maksimum 1.600 px, serta ikut tersimpan saat proyek disimpan.
- [x] Buat fitur tetap ringan pada perangkat lama: pratinjau mode Hemat membatasi frame ke 18 fps/18 partikel dan resolusi pixel 1×, gambar diperkecil satu kali sebelum dipakai, serta tidak ada aset yang perlu diunduh dari jaringan. Uji kode dan pratinjau selesai; kelancaran pada perangkat fisik masih perlu diuji.

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
- [x] Analisis dan adaptasi video referensi pengguna: lengkungan simetris, bokeh, judul, dan progress player. Implementasi menyediakan 10 pilihan EQ dan 12 skin partikel aktif plus Off.
- [ ] Pastikan kelancaran di HP Android 7.1.2 RAM 3 dan PC Windows 7 32-bit RAM 3 melalui pengujian langsung perangkat; mode hemat telah tersedia, tetapi belum diuji pada perangkat target.
- [x] Buat repository GitHub private berisi source aplikasi Android dan Workflow GitHub Actions yang membangun APK installable; terbitkan APK pada GitHub Releases agar dapat diunduh pengguna. Repository utama Mobile tetap Manus-managed. Source ada di `paklekucup-keren/audio-visualizer-studio-android` branch `main`; rilis terbaru v1.0.3 selesai pada run `40209720636` dengan APK serta ZIP.
- [x] Setelah APK dibangun dan hasil implementasi final siap, beritahu pengguna melalui percakapan ini serta jelaskan hasil pengujian/perangkat fisik yang masih diperlukan.
