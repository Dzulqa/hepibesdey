# 🎂 Website Ulang Tahun Spesial: "To My Dearest Alika ♡"

Website ulang tahun interaktif, responsif, dan estetik bertema romantic blush pink yang dibuat khusus untuk Alika. Dibangun menggunakan **Next.js (App Router)** dan **Tailwind CSS**.

---

## ✨ Fitur & Komponen Utama (Sesuai Desain)

1. **Header & Navigation**:
   - Logo *"Alika ♡"* dengan tipografi tulisan tangan yang manis.
   - Navigasi cepat: `Home`, `Messages`, `Memories`, `Gallery`, `Surprise`.
   - Tombol spesial **"For You ♡"** yang membuka modal penuh cinta.
   - **Mode Gelap / Terang (Starry Night Mode)**: Beralih ke suasana malam berbintang yang romantis.
   - **Music Toggle**: Kontrol cepat pemutar musik latar di navbar.
   - **Responsive Drawer Menu**: Tampilan navigasi yang rapi di layar HP.

2. **Hero Section (Scrapbook Aesthetic)**:
   - Badge *"Happy Birthday"*.
   - Headline romantis: *"To My Dearest Alika"*.
   - Tombol CTA: *"Lihat Pesan ♡"* & *"Main Dulu"*.
   - Komposisi Scrapbook Polaroid bertingkat dengan washi tape, stiker *"More Happy"*, *"More Love"*, *"More Alika"*, serta caption tulisan tangan *"Happy Birthday ♡"*.

3. **5 Quick Navigation Cards**:
   - `Surprise` (Kado & Kupon Cinta)
   - `Messages` (Surat Spesial)
   - `Memories` (Timeline Perjalanan)
   - `Gallery` (Galeri Foto)
   - `Mini Games` (Kuis & Gosok Hadiah)

4. **Interactive Widgets**:
   - **Birthday Countdown**: Penghitung mundur real-time (Hari, Jam, Menit, Detik) dengan fitur atur tanggal dan tombol *"Rayakan 🎉"* yang memicu ledakan konfeti.
   - **Our Song ♡ Player**: Pemutar musik *"Until I Found You" - Stephen Sanchez* dengan progres scrubber, waktu bermain, tombol Like beranimasi hati, serta synthesizer melodi piano romantis otomatis.

5. **"A Few Reasons Why I Love You"**:
   - 6 kartu alasan cinta berdesain kaca lembut (*glassmorphism*).
   - Setiap kartu dapat diklik untuk membaca pesan dan alasan mendalam.
   - Catatan tulisan tangan *"Thank you for being you ♡"*.

6. **Wishes & Polaroid Showcase**:
   - Ucapan doa penuh ketulusan untuk Alika.
   - 4 foto polaroid miring estetik dengan washi tape dan caption.
   - Klik foto untuk membuka *Fullscreen Lightbox*.

7. **A Special Message For You (Surat Cinta Interaktif)**:
   - Amplop 3D interaktif bersegel hati merah (*wax seal*). Klik untuk membuka amplop dan surat akan melipat terbuka.
   - Surat cinta panjang penuh makna dengan tanda tangan romantis.
   - Form balasan interaktif agar Alika bisa menulis pesan balik (tersimpan otomatis di browser).

8. **Our Story Through Time (Memories Timeline)**:
   - Garis waktu perjalanan hubungan dari *"Awal Kenal"*, *"Kencan Pertama"*, *"Liburan Berdua"*, hingga *"Ulang Tahun Hari Ini"*.
   - Dilengkapi tombol untuk menambahkan momen kenangan baru.

9. **Our Gallery**:
   - Galeri foto estetik dengan filter kategori (*Semua*, *Foto Favorit*, *Kencan Kita*, *Momen Lucu*).
   - Tombol *Like* interaktif dengan penghitung jumlah suka.
   - Fitur upload foto langsung dari perangkat dengan kompresi otomatis & sinkronisasi real-time antar perangkat (upload di HP kamu, seketika muncul di HP Alika).

10. **Surprises & Mini Games**:
    - **Kotak Kado 3D**: Klik untuk membuka kado dan memicu hujan konfeti!
    - **Kupon Cinta Virtual**: 4 voucher romantis (*Voucher Kencan Bebas Pilih*, *Voucher Peluk Hangat*, *Voucher Jajan/Es Krim*, *Voucher Bebas Cemberut*) yang bisa langsung diklaim dengan stempel *"TERKLAIM ♡"*.
    - **Kartu Gosok Rahasia**: Klik untuk menggosok lapisan dan membuka pesan rahasia.
    - **Kuis Cinta**: Kuis seru *"Seberapa Tahu Alika Tentang Kita?"* dengan kalkulasi skor otomatis.

---

## 📸 Cara Mengganti Foto Sendiri

Semua foto dummy sudah disiapkan di dalam folder [`public/images/`](file:///c:/Users/ThinkPad/Desktop/project/Nextjs/alika/public/images/):

1. **Foto Utama (Hero Polaroid)**: Ganti file `public/images/alika_hero.jpg` dengan foto Alika favoritmu.
2. **Foto Sunset / Pantai**: Ganti file `public/images/polaroid_sunset.jpg`.
3. **Foto Kucing / Lucu**: Ganti file `public/images/polaroid_cat.svg` (bisa gunakan `.jpg` atau `.png`).
4. **Foto Lainnya**: Kamu juga bisa langsung upload foto baru lewat tombol *"Upload Foto Baru"* di bagian Galeri saat web berjalan. Foto akan otomatis tersimpan di Cloud Supabase dan langsung muncul di HP pasanganmu secara real-time.

---

## 🎵 Mengganti Lagu Latar

Secara default, website sudah dilengkapi dengan melodi piano romantis berbasis Web Audio API sehingga musik langsung berbunyi merdu tanpa perlu file eksternal. Jika kamu ingin menggunakan file lagu mp3 asli:
- Letakkan file mp3 kamu di folder `public/audio/` dengan nama `until_i_found_you.mp3`.

---

## 📱 Fitur PWA (Progressive Web App) & Offline Mode

Aplikasi ini sudah berstatus **PWA Standalone** penuh dan dapat diinstall di HP Android, iPhone, maupun PC/Laptop Windows:

1. **Bisa Diinstall di Android**:
   - Buka website di browser Chrome / Samsung Internet.
   - Klik tombol **"Install App"** di navbar atau banner bawah, atau tekan titik tiga (⋮) > **"Tambahkan ke Layar Utama" / "Install Aplikasi"**.
   - Aplikasi akan memiliki ikon sendiri di layar beranda HP seperti aplikasi Play Store.

2. **Bisa Diinstall di Windows / PC**:
   - Buka website di Google Chrome atau Microsoft Edge.
   - Klik tombol **"Install App"** di navbar atau klik ikon monitor/install (+) di ujung bilah URL (omnibox).
   - Aplikasi akan terpasang di Start Menu, desktop, dan taskbar Windows dengan jendela mandiri (*standalone window*).

3. **100% Berfungsi Secara Offline**:
   - Menggunakan Service Worker & Workbox yang secara otomatis melakukan *pre-cache* terhadap:
     - Semua halaman dan rute (termasuk halaman fallback `~offline`).
     - Seluruh foto kenangan & galeri (`/images/*`).
     - Seluruh file musik lagu romantis (`/audio/*`).
     - Seluruh font Google (Caveat, Dancing Script, Playfair Display, Plus Jakarta Sans).
   - Saat internet dimatikan atau offline, user tetap bisa membuka web, melihat galeri, mendengarkan musik, dan mengetik balasan pesan (pesan akan tersimpan di antrean offline lokal dan otomatis tersinkronisasi saat kembali terhubung ke internet).

---

## 🚀 Cara Menjalankan Project

```bash
# Jalankan server development
npm run dev

# Jalankan build produksi (untuk menguji Service Worker PWA secara penuh)
npm run build
npm start

# Buka di browser
# Kunjungi http://localhost:3000
```

