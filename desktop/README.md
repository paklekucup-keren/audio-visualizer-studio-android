# Audio Visualizer Studio — Windows x86

Aplikasi desktop portable ditargetkan untuk Windows 7 SP1 32-bit (x86). Jalankan `Audio-Visualizer-Studio-1.0.0-ia32.exe`; program dibuka langsung sebagai alat desktop tanpa browser, akun, layanan cloud, atau koneksi internet. Impor audio, sunting visual/lirik, simpan proyek JSON, lalu pilih lokasi keluaran video atau master audio. Saat membuka ulang proyek JSON, pilih kembali audio lokal.

Visualizer mencakup sembilan bentuk EQ dan dua belas skin partikel, kontrol warna/ukuran/jumlah/intensitas, dan preset performa low/balanced/high; aplikasi dibuka dengan mode Hemat sebagai default awal. Lirik mendukung timestamp yang dapat diedit, font sistem, serta font lokal selama sesi. Sinkronisasi onset otomatis dibatasi ke audio hingga 20 MB dan lima menit untuk menghindari decoding PCM besar; trek lebih besar/panjang memakai pembagian cue berdasarkan durasi, lalu dapat dikoreksi manual. Sinkronisasi ini bukan pengenalan kata/vokal.

Build memakai Electron 22.3.27 karena lini Electron 22 adalah lini terakhir yang mendukung Windows 7. Dukungan keamanan upstream untuk versi ini sudah berakhir. Aplikasi membatasi navigasi/IPC dan permintaan jaringan serta tidak memuat konten jarak jauh. Gunakan hanya file media tepercaya; jangan gunakan program sebagai peramban.

Ekspor menyediakan rasio 16:9, 9:16, dan 1:1, dengan pilihan 720p/1080p dan 24/30 fps. Program menulis video sementara bertahap, lalu memakai FFmpeg x86 yang dibundel untuk membuat MP4 H.264. Jika audio sumber kompatibel dengan MP4, aplikasi menyalin stream sumber tanpa encoding ulang. Bila tidak kompatibel, opsi AAC 320 kbps harus disetujui di panel Ekspor; jika tidak disetujui, video WebM lokal dipertahankan. Tombol Master menyimpan file audio sumber tanpa mengubah bitstream. Platform sosial dapat meng-encode ulang unggahan setelah file dikirim ke platform.

Perintah packaging dari direktori `desktop/` adalah `pnpm pack:win32`. Hasil portable ditempatkan di `desktop/release/`. Build Linux memverifikasi packaging x86, tetapi bukan uji instalasi atau pemutaran langsung pada PC Windows 7 pengguna; kelancaran di PC target perlu diuji langsung.

Paket menyertakan executable FFmpeg x86 sebagai program lokal terpisah. Notice lisensi dan teks GPL-3.0 tersedia di folder resources paket. Periksa kewajiban redistribusi sebelum distribusi publik atau komersial.
