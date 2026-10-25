# Android source dan APK di GitHub

Repository GitHub private untuk source Android: [paklekucup-keren/audio-visualizer-studio-android](https://github.com/paklekucup-keren/audio-visualizer-studio-android). Repository utama Mobile tetap Manus-managed; GitHub menjadi mirror source dan tempat unduh rilis Android.

Workflow `.github/workflows/android-apk.yml` membangun APK debug-signed yang dapat dipasang untuk uji perangkat. Workflow meng-generate project Android native dari Expo dan mengunggah hasil ke GitHub Actions Artifacts. Run sukses pertama: [GitHub Actions run #2](https://github.com/paklekucup-keren/audio-visualizer-studio-android/actions/runs/40190463074) pada commit `a1b54d7e82791ba399a6ce360c3b495bafadcd93`.

## Rilis saat ini

- Tag: `android-v1.0.0`
- Release: [Audio Visualizer Studio Android v1.0.0](https://github.com/paklekucup-keren/audio-visualizer-studio-android/releases/tag/android-v1.0.0)
- Berkas: `app-debug.apk`, sekitar 120 MiB (124,840,200 byte)
- SHA-256: `be55f9f2e2bc1542f274240075d3a97937dac3fb6a353a9ce9bf3363a7ba2ab2`
- Status: debug-signed prerelease untuk sideload/uji, bukan signing produksi Play Store.

Untuk memasang pada Android 7.1+, unduh `app-debug.apk` dari aset release. Jika Android meminta izin instalasi dari sumber tersebut, izinkan untuk browser atau aplikasi Files yang dipakai, lalu jalankan APK untuk memasang. Repository bersifat private; buka dengan akun GitHub yang mempunyai akses ke repo.

Workflow dapat dijalankan manual dari tab **Actions → Android APK → Run workflow**. Untuk rilis berikutnya, push tag dengan pola `android-v*`; workflow akan membangun APK dan melampirkannya pada GitHub prerelease. Instalasi dan kelancaran pada HP target tetap perlu diverifikasi langsung di perangkat pengguna.
