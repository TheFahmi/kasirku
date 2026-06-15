# KasirKu

KasirKu adalah aplikasi Point of Sale (POS) berbasis web yang ringan dan dirancang khusus untuk lingkungan offline. Aplikasi ini berjalan sepenuhnya di sisi klien (browser) tanpa memerlukan server backend, menggunakan LocalStorage untuk persistensi data dan Web Crypto API untuk keamanan cadangan data.

## Fitur

- **Arsitektur Offline-First**: Seluruh fungsionalitas berjalan secara lokal tanpa memerlukan koneksi internet aktif.
- **Keamanan Enkripsi**: Fitur ekspor dan impor data diamankan menggunakan algoritma AES-GCM via Web Crypto API.
- **Single-File Build**: Proses kompilasi menghasilkan satu file HTML mandiri yang sudah memuat seluruh aset (JS & CSS) untuk kemudahan distribusi.
- **Performa Ringan**: Inti aplikasi dibangun murni dengan Vanilla JavaScript (ES Modules) tanpa memuat framework tambahan.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES Modules)
- **Bundler**: Vite, `vite-plugin-singlefile`
- **Penyimpanan**: LocalStorage API
- **Kriptografi**: Web Crypto API (AES-GCM)

## Prasyarat

- [Node.js](https://nodejs.org/) (disarankan versi 18 ke atas)

## Instalasi & Pengembangan

1. *Clone* repositori ini ke mesin lokal Anda:
   ```bash
   git clone https://github.com/TheFahmi/kasirku.git
   cd kasirku
   ```

2. Lakukan instalasi dependensi:
   ```bash
   npm install
   ```

3. Jalankan *development server*:
   ```bash
   npm run dev
   ```

## Build & Deployment

Untuk mengompilasi kode sumber menjadi versi produksi, jalankan perintah berikut:

```bash
npm run build
```

Hasil kompilasi (berupa file HTML tunggal) akan dihasilkan pada direktori `dist/`.

### Penggunaan Lokal (Offline)
Untuk menggunakan aplikasi secara luring, Anda cukup membuka file `dist/index.html` menggunakan peramban web modern. Sistem ini tidak memerlukan *local web server* tambahan.

### Deployment Publik
Karena keluaran *build* bersifat statis, file `dist/index.html` dapat diunggah secara langsung ke berbagai layanan *static hosting* (seperti GitHub Pages, Vercel, Netlify) atau ditempatkan pada direktori root *web server* tradisional (Nginx, Apache).
