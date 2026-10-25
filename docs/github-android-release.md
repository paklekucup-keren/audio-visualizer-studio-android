# Android source dan APK di GitHub

Repository GitHub private untuk source Android: [paklekucup-keren/audio-visualizer-studio-android](https://github.com/paklekucup-keren/audio-visualizer-studio-android). Repository utama Mobile tetap Manus-managed; GitHub menjadi mirror source dan tempat unduh rilis Android.

## Rilis terbaru: v1.0.2 standalone

- Tag: `android-v1.0.2`
- Release: [Audio Visualizer Studio Android v1.0.2](https://github.com/paklekucup-keren/audio-visualizer-studio-android/releases/tag/android-v1.0.2)
- APK langsung: [Audio-Visualizer-Studio-v1.0.2.apk](https://github.com/paklekucup-keren/audio-visualizer-studio-android/releases/download/android-v1.0.2/Audio-Visualizer-Studio-v1.0.2.apk)
- Arsip unduh-ekstrak: [Audio-Visualizer-Studio-Android-v1.0.2.zip](https://github.com/paklekucup-keren/audio-visualizer-studio-android/releases/download/android-v1.0.2/Audio-Visualizer-Studio-Android-v1.0.2.zip)
- Build: GitHub Actions run [`40206740511`](https://github.com/paklekucup-keren/audio-visualizer-studio-android/actions/runs/40206740511), sukses melalui `:app:assembleRelease` setelah sekitar 32 menit.
- Pemeriksaan artefak: APK memuat `assets/index.android.bundle` (3.875.000 byte); ZIP lolos pemeriksaan integritas dan memuat APK identik byte demi byte serta `PETUNJUK.txt`.
- Ukuran APK: 63.744.962 byte; SHA-256 `fad7964ad1e2a45f9d43c8fc3688b5d9c18d322ce9b625dc7405ac80409afbe0`.
- Ukuran ZIP: 63.745.645 byte; SHA-256 `dddec0c5c9ffdf8f1a36e8a8e5f155f8c7afc719c76480c56186f49b651c1570`.
- Catatan v1.0.2: fitur lengkungan simetris, bokeh, kecepatan/ukuran, Particle Overlay, EQ tiga-band, gambar latar, dan judul/progress tersedia. Tombol Simpan/Buka proyek masih tersembunyi pada lebar layar ponsel; perbaikan responsif sudah diverifikasi di Preview dan perlu rilis APK lanjutan. Uji langsung Android 7.1.2 RAM 3 GB belum dilakukan.

Untuk memasang v1.0.2: unduh APK langsung atau unduh ZIP lalu ekstrak dengan Files/Pengelola File; ketuk `Audio-Visualizer-Studio-v1.0.2.apk` (jangan mengekstrak isi APK). Izinkan instalasi dari sumber tersebut jika Android memintanya. Coba pasang sebagai pembaruan terlebih dahulu; jika Android menolak karena konflik tanda tangan/paket, hapus aplikasi lama lalu pasang v1.0.2. Menghapus aplikasi dapat menghapus data lokal. Repository private sehingga perlu login ke akun GitHub yang memiliki akses.

## Rilis sebelumnya: v1.0.1 standalone

- Tag: `android-v1.0.1`
- Release: [Audio Visualizer Studio Android v1.0.1](https://github.com/paklekucup-keren/audio-visualizer-studio-android/releases/tag/android-v1.0.1)
- APK langsung: [Audio-Visualizer-Studio-v1.0.1.apk](https://github.com/paklekucup-keren/audio-visualizer-studio-android/releases/download/android-v1.0.1/Audio-Visualizer-Studio-v1.0.1.apk)
- Arsip untuk diunduh dan diekstrak di HP: [Audio-Visualizer-Studio-Android-v1.0.1.zip](https://github.com/paklekucup-keren/audio-visualizer-studio-android/releases/download/android-v1.0.1/Audio-Visualizer-Studio-Android-v1.0.1.zip)
- Build: GitHub Actions run [`40195574929`](https://github.com/paklekucup-keren/audio-visualizer-studio-android/actions/runs/40195574929), sukses melalui Gradle `:app:assembleRelease`.
- Pemeriksaan artefak: APK dikenali sebagai paket Android dan memuat `assets/index.android.bundle` (3.840.132 byte); ZIP lolos pemeriksaan integritas, berisi APK yang identik byte demi byte dan `PETUNJUK.txt`.
- Ukuran APK: 63.710.010 byte; SHA-256 `d2dc58e0e8daa3272bb338e97009a33db8940b74b719746ca1a60543b9d96cbc`.
- Ukuran ZIP: 63.710.693 byte; SHA-256 `dfd5a522f2e11a97ba8bcc11eb76880ddfb88392ac0d1b8be6e06740c3712597`.
- Release berstatus prerelease/sideload. Paket bukan APK Play Store yang ditandatangani untuk distribusi produksi. Pengujian langsung pada Android 7.1.2 RAM 3 GB belum tersedia.

Untuk memasang: unduh APK langsung atau unduh ZIP lalu ekstrak dengan Files/Pengelola File; ketuk `Audio-Visualizer-Studio-v1.0.1.apk` untuk memasang—jangan mengekstrak isi APK. Izinkan instalasi dari sumber tersebut jika Android memintanya. Coba pasang sebagai pembaruan terlebih dahulu; jika Android menolak karena konflik tanda tangan/paket, hapus aplikasi lama lalu pasang v1.0.1. Menghapus aplikasi dapat menghapus data lokal aplikasi. Repository bersifat private, jadi buka release dengan akun GitHub yang memiliki akses.

Workflow `.github/workflows/android-apk.yml` membangun APK debug-signed yang dapat dipasang untuk uji perangkat. Workflow meng-generate project Android native dari Expo dan mengunggah hasil ke GitHub Actions Artifacts. Run sukses pertama: [GitHub Actions run #2](https://github.com/paklekucup-keren/audio-visualizer-studio-android/actions/runs/40190463074) pada commit `a1b54d7e82791ba399a6ce360c3b495bafadcd93`.

## Rilis sebelumnya: v1.0.0 (jangan digunakan)

- Tag: `android-v1.0.0`
- Release: [Audio Visualizer Studio Android v1.0.0](https://github.com/paklekucup-keren/audio-visualizer-studio-android/releases/tag/android-v1.0.0)
- Arsip mudah diekstrak di HP: [Audio-Visualizer-Studio-Android-v1.0.0.zip](https://github.com/paklekucup-keren/audio-visualizer-studio-android/releases/download/android-v1.0.0/Audio-Visualizer-Studio-Android-v1.0.0.zip)
- Isi ZIP: `Audio-Visualizer-Studio-v1.0.0.apk` dan `PETUNJUK.txt`
- APK: sekitar 120 MiB (124,840,200 byte); SHA-256 `be55f9f2e2bc1542f274240075d3a97937dac3fb6a353a9ce9bf3363a7ba2ab2`
- ZIP: 124,841,015 byte; SHA-256 `51d240c81328b26915cbc7e6853242bf2f2c2f038fc0adcdffc8df06f5c1ab1f`
- Status: debug-signed prerelease untuk sideload/uji, bukan signing produksi Play Store.

v1.0.0 adalah build debug awal yang memerlukan Metro dan dapat berhenti di splash jika dipasang mandiri. Jangan pasang versi tersebut; gunakan v1.0.1 di bagian atas.

Workflow dapat dijalankan manual dari tab **Actions → Android APK → Run workflow**. Untuk rilis bertag baru, push tag dengan pola `android-v*`; workflow menghasilkan APK/ZIP dan GitHub prerelease. Instalasi, audio offline, ekspor/share, dan kelancaran masih perlu dikonfirmasi langsung pada perangkat target.
