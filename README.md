# KasirKu: Enterprise Omnichannel POS System

KasirKu telah berevolusi dari aplikasi POS Vanilla JS *Offline-First* menjadi sistem arsitektur berskala *Enterprise* modern berstruktur **Monorepo**. Aplikasi ini sekarang ditenagai oleh **Next.js** (Frontend) dan **NestJS** (Backend API), terhubung langsung ke **PostgreSQL**, serta siap untuk didistribusikan menggunakan **Docker Compose**.

KasirKu didesain untuk melayani dua mode bisnis besar secara simultan (Omnichannel):
- 👕 **Bisnis Laundry / Jasa**: Mendukung manajemen *Customer Quota*, pelacakan *Order Status*, dan Portal Publik untuk melihat riwayat cucian.
- 🍔 **Bisnis F&B / Restoran**: Mendukung mode pemesanan via *QR Menu* mandiri dari meja, serta dilengkapi dengan *Kitchen Display System (KDS)* lengkap dan *Public Queue Display* untuk sistem antrean modern.

---

## 🌟 Fitur Utama

### 💻 Point of Sale (POS) Dashboard
- **React/Next.js UI**: UI legacy telah di- *porting* dengan sempurna (pixel-perfect) ke React menggunakan Tailwind CSS, menjaga desain *glassmorphism* modern.
- **Manajemen Keranjang Lanjutan**: Menggunakan **Zustand** untuk *state management* agar interaksi belanja, pemilihan varian, hingga proses pembayaran lebih instan tanpa *reload*.
- **Data Tersinkronisasi**: Sistem sudah tidak lagi bergantung pada LocalStorage. Seluruh data (Produk, Transaksi, Pelanggan) langsung tersinkronisasi via REST API NestJS.

### 👕 Modul Laundry
- **Customer Portal (`/`)**: Pelanggan bisa melacak status pesanan, piutang yang belum lunas, dan mengecek Sisa Kuota Kiloan cukup dengan memasukkan nomor WhatsApp.
- **Laundry Dashboard (`/laundry/dashboard`)**: Ruang khusus untuk pelanggan memantau grafik cuci dan *active orders*.
- **Request Pickup**: Formulir mandiri dari portal untuk memanggil kurir penjemput cucian.

### 🍔 Modul Resto (Food & Beverage)
- **Self-Ordering QR Menu (`/menu/[tableId]`)**: Menu digital interaktif dengan kapabilitas "Tambah ke Keranjang" dan "Pesan Sekarang" yang langsung terhubung ke sistem dapur.
- **Kitchen Display System (`/kitchen`)**: *Kanban board* (Mode Gelap) khusus dapur yang me- *refresh* pesanan secara real-time. Memiliki satu tombol aksi: "Tandai Selesai" (Update Status).
- **Public Queue Display (`/queue`)**: Layar antrean eksternal (layar ganda) menampilkan daftar antrean makanan (*Sedang Disiapkan* vs *Silakan Ambil*) dengan animasi *pulsing* interaktif.

---

## 🛠️ Arsitektur Tech Stack

Sistem dibangun menggunakan **NPM Workspaces** untuk konfigurasi Monorepo.

### 1. Frontend (`apps/web`)
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + CSS Module
- **State Management**: Zustand
- **Koneksi API**: Native Fetch API

### 2. Backend (`apps/api`)
- **Framework**: NestJS (TypeScript)
- **Database ORM**: TypeORM
- **Fitur Utama**: REST API Controllers untuk `Products`, `Orders`, `Customers`, dan `Transactions`.

### 3. Infrastructure (`docker-compose.yml`)
- **Database Utama**: PostgreSQL 15
- Manajemen otomatis *networking* dan port antar- *container*.

---

## 🚀 Cara Menjalankan Aplikasi (Local Development)

### Prasyarat
- [Node.js](https://nodejs.org/) (Versi 18+ disarankan)
- [Docker](https://www.docker.com/) & Docker Compose

### 1. Inisialisasi Database
Jalankan servis *PostgreSQL* di dalam container Docker:
```bash
docker-compose up -d
```
*(Database akan terekspos di port lokal `5435`, sesuai konfigurasi docker-compose).*

### 2. Jalankan Backend (NestJS)
Buka terminal baru, navigasi ke dalam *workspace* API, dan nyalakan server:
```bash
cd apps/api
npm install
npm run start:dev
```
*(Backend NestJS akan berjalan pada `http://localhost:3005` dengan Sinkronisasi TypeORM otomatis).*

### 3. Jalankan Frontend (Next.js)
Buka terminal baru lainnya, navigasi ke *workspace* Web:
```bash
cd apps/web
npm install
npm run dev
```
*(Frontend Next.js akan berjalan pada `http://localhost:3000`).*

---

## 🗺️ Peta Navigasi Aplikasi

Ketika server berjalan, Anda dapat menavigasi ke *endpoints* berikut di browser:

- **Kasir / POS Utama**: `http://localhost:3000/pos`
- **Customer Portal**: `http://localhost:3000/`
- **Dashboard Pelanggan**: `http://localhost:3000/laundry/dashboard`
- **QR Menu Resto**: `http://localhost:3000/menu/1` (Atau ganti '1' dengan id meja apapun)
- **Layar Dapur (KDS)**: `http://localhost:3000/kitchen`
- **Layar Antrean (Queue)**: `http://localhost:3000/queue`

---

*Hak Cipta © 2026 KasirKu Monorepo.*
