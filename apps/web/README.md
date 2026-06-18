# KasirKu Web (Next.js Frontend)

Ini adalah antarmuka *Frontend* utama untuk ekosistem KasirKu. Aplikasi ini mengelola seluruh pengalaman interaksi pengguna dari hulu ke hilir—dari Point of Sale (POS) bagi staf kasir, hingga Portal Publik dan QR Menu untuk pelanggan.

Aplikasi ini menggunakan fitur paling mutakhir dari **Next.js 14 (App Router)** dan *Styling* dengan **Tailwind CSS**.

## ✨ Modul Tersedia

- **POS Dashboard (`/pos`)**: Antarmuka kasir super cepat yang di-*porting* langsung dari vanilla JS POS lama Anda. Sudah menggunakan **Zustand** untuk manajemen keranjang belanja yang instan dan handal.
- **Portal Pelanggan (`/`)**: Layanan pengecekan kuota laundry, tagihan (piutang), dan form interaktif untuk pemesanan *Pickup* cucian.
- **Laundry Dashboard (`/laundry/dashboard`)**: Ruang pribadi pelanggan untuk melihat status cucian dan sisa kuota kiloan secara *real-time*.
- **QR Menu Resto (`/menu/[tableId]`)**: Antarmuka *mobile-first* bergaya elegan bagi pelanggan resto untuk memesan dari meja masing-masing.
- **Kitchen Dashboard / KDS (`/kitchen`)**: Layar sentuh *Kanban Board* mode gelap khusus untuk koki di dapur guna menerima pesanan dan menandai "Selesai".
- **Layar Antrean Publik (`/queue`)**: Layar pemonitor status pesanan interaktif (split-screen) untuk dipasang di ruang tunggu pelanggan F&B.

## 🚀 Memulai (Development)

Pastikan *Backend API* (NestJS) sudah menyala di `http://localhost:3005` sebelum menjalankan frontend ini agar data bisa ditarik secara optimal.

Buka terminal di direktori `apps/web` dan jalankan:

```bash
# Instalasi dependensi
npm install

# Jalankan server
npm run dev
```

Aplikasi web akan tersedia di [http://localhost:3000](http://localhost:3000).

## 🛠️ Tech Stack & Konvensi

- **React Framework**: Next.js 14+ (App Router `src/app`)
- **UI/UX**: Desain Glassmorphism (Vibrant Accent, Semi-Transparent Surface) diimplementasikan dengan Tailwind CSS (`src/app/pos.css` & Global CSS).
- **State Management**: Zustand (`src/store/usePosStore.ts`) untuk performa maksimal pengganti *AppState.js* lawas.
- **Integrasi Backend**: Native API `fetch()` disinkronisasikan di dalam layer *Zustand* agar reaktif terhadap pembaruan UI.

## 📦 Build untuk Production

Untuk men- *deploy* proyek ke Vercel atau environment produksi lainnya:

```bash
npm run build
npm start
```

---
*Dibangun khusus untuk memenuhi skenario bisnis Enterprise KasirKu Monorepo.*
