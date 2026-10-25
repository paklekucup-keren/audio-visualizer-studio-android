# Android source dan APK di GitHub

Repository GitHub yang direncanakan adalah mirror privat untuk source dan artefak Android. Repository Manus tetap menjadi sumber kanonis proyek Mobile.

Workflow `.github/workflows/android-apk.yml` membuat APK Android debug-signed yang dapat dipasang untuk uji perangkat. Workflow membangkitkan project Android native dari konfigurasi Expo, membangun APK secara offline setelah dependency tersedia, dan mengunggahnya sebagai artifact selama 30 hari. Karena APK menggunakan debug signing, berkas ini ditujukan untuk pengujian/pemasangan manual, bukan untuk publikasi Play Store.

Untuk build uji dari GitHub Actions, jalankan **Android APK → Run workflow**. Unduh `app-debug.apk` dari bagian Artifacts pada hasil run. Untuk menyimpan versi di GitHub Releases, push tag dengan pola `android-v*` (contoh `android-v1.0.0`); workflow akan membuat prerelease dan melampirkan APK.

APK belum dianggap tersedia sampai sebuah workflow selesai sukses dan artifact/release benar-benar muncul. Tidak ada token atau keystore yang disimpan di source.
