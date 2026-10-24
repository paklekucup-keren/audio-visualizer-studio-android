# Catatan teknis — Audio Visualizer Studio

Diperiksa pada 25 Oktober 2026 untuk menentukan jalur implementasi dan batas kompatibilitas.

## Android dan file lokal

Expo SDK 57 mencantumkan Android 7+ sebagai batas OS dan proyek mengatur `minSdkVersion: 24`; Android 7.1.2 menjadi target API yang sesuai, tetapi keberhasilan tetap perlu diuji pada perangkat nyata. Build APK memakai profil `preview` dengan `android.buildType: apk`; APK belum tersedia sebelum build Dashboard selesai. [1] [2]

Dokumentasi FileSystem SDK 57 mendukung file pada `Paths.document`, pembukaan melalui `File.open`, dan penulisan potongan melalui `FileHandle.writeBytes`. Aplikasi memanfaatkan storage privat ini untuk menghindari permission storage umum. Expo Sharing menerima URI file lokal melalui `shareAsync()` di Android sehingga pengguna dapat memilih tujuan berbagi/penyimpanan melalui system chooser. [3] [4]

## Media dan kualitas audio

`MediaRecorder.isTypeSupported()` membantu mengenali MIME type yang didukung runtime; format tetap bergantung pada WebView/perangkat dan kemampuan resource. Android merekam memakai codec yang tersedia di perangkat dan menyimpan file audio master terpisah. Windows memakai FFmpeg untuk MP4 H.264 dan menyalin stream audio sumber tanpa encoding ulang hanya jika codec/container cocok. Opsi AAC 320 kbps memerlukan persetujuan eksplisit; jika pengguna tidak mengizinkan konversi, hasil WebM dipertahankan. [5] [6]

File master dapat dijaga tanpa perubahan oleh program, tetapi layanan sosial dapat meng-encode ulang unggahan. Karena itu aplikasi dapat menjaga file sumber yang diunduh secara lokal, bukan menjamin kualitas bit-perfect setelah proses unggah pihak ketiga.

## Target Windows 7 x86

Electron 22 merupakan major terakhir yang mendukung Windows 7; lini itu tidak lagi menerima security fixes reguler. Electron-builder masih memiliki arsitektur `ia32`, sehingga desktop dirancang sebagai executable portable Windows 32-bit yang sepenuhnya offline. Ini menetapkan target penggunaan, bukan bukti uji langsung pada hardware Windows 7 pengguna. [7] [8]

Paket encoder yang digunakan adalah `@ffmpeg-installer/win32-ia32` 4.1.0; metadata paket menyebut GPLv3. Aplikasi menjalankan binary terpisah secara lokal. Paket desktop menyertakan notice dan link sumber/lisensi; kewajiban redistribusi perlu ditinjau sebelum distribusi publik/komersial. [9]

## Referensi

[1]: https://docs.expo.dev/versions/latest/ "Expo SDK reference"
[2]: https://docs.expo.dev/build-reference/apk/ "Build APKs for Android"
[3]: https://docs.expo.dev/versions/v57.0.0/sdk/filesystem/ "Expo FileSystem SDK 57"
[4]: https://docs.expo.dev/versions/v57.0.0/sdk/sharing/ "Expo Sharing SDK 57"
[5]: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static "MediaRecorder isTypeSupported"
[6]: https://docs.expo.dev/versions/latest/sdk/video/ "Expo Video playback API"
[7]: https://electronjs.org/blog/windows-7-to-8-1-deprecation-notice "Electron Windows 7 support notice"
[8]: https://www.electron.build/docs/architecture/ "electron-builder architecture"
[9]: https://www.npmjs.com/package/@ffmpeg-installer/win32-ia32 "Windows x86 FFmpeg installer package"
