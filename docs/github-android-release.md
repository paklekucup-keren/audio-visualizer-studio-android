# Android source dan APK di GitHub

Repository GitHub private untuk source Android: [paklekucup-keren/audio-visualizer-studio-android](https://github.com/paklekucup-keren/audio-visualizer-studio-android). Repository utama Mobile tetap Manus-managed; GitHub menjadi mirror source dan tempat unduh rilis Android.

Workflow `.github/workflows/android-apk.yml` membangun APK debug-signed yang dapat dipasang untuk uji perangkat. Workflow meng-generate project Android native dari Expo dan mengunggah hasil ke GitHub Actions Artifacts. Run sukses pertama: [GitHub Actions run #2](https://github.com/paklekucup-keren/audio-visualizer-studio-android/actions/runs/40190463074) pada commit `a1b54d7e82791ba399a6ce360c3b495bafadcd93`.

## Rilis saat ini

- Tag: `android-v1.0.0`
- Release: [Audio Visualizer Studio Android v1.0.0](https://github.com/paklekucup-keren/audio-visualizer-studio-android/releases/tag/android-v1.0.0)
- Arsip mudah diekstrak di HP: [Audio-Visualizer-Studio-Android-v1.0.0.zip](https://github.com/paklekucup-keren/audio-visualizer-studio-android/releases/download/android-v1.0.0/Audio-Visualizer-Studio-Android-v1.0.0.zip)
- Isi ZIP: `Audio-Visualizer-Studio-v1.0.0.apk` dan `PETUNJUK.txt`
- APK: sekitar 120 MiB (124,840,200 byte); SHA-256 `be55f9f2e2bc1542f274240075d3a97937dac3fb6a353a9ce9bf3363a7ba2ab2`
- ZIP: 124,841,015 byte; SHA-256 `51d240c81328b26915cbc7e6853242bf2f2c2f038fc0adcdffc8df06f5c1ab1f`
- Status: debug-signed prerelease untuk sideload/uji, bukan signing produksi Play Store.

Untuk memasang pada Android 7.1+, unduh ZIP melalui tautan di atas, ekstrak dengan Files/Pengelola File, lalu ketuk `Audio-Visualizer-Studio-v1.0.0.apk`. Jangan mengekstrak isi APK; ketuk APK untuk memasang. Jika Android meminta izin instalasi dari sumber tersebut, izinkan browser atau aplikasi Files yang digunakan. Repository bersifat private; buka dengan akun GitHub yang memiliki akses. Berkas APK langsung juga tersedia di aset `app-debug.apk` pada Release.

Workflow dapat dijalankan manual dari tab **Actions → Android APK → Run workflow**. Untuk rilis berikutnya, push tag dengan pola `android-v*`; workflow akan membangun APK dan melampirkannya pada GitHub prerelease. Instalasi dan kelancaran di HP target tetap perlu diverifikasi langsung pada perangkat pengguna.
