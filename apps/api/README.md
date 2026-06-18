<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

# KasirKu API (NestJS Backend)

Modul ini adalah layanan *Backend REST API* utama untuk ekosistem KasirKu. Dibangun menggunakan framework **NestJS** dan mengelola seluruh logika bisnis, transaksi, dan integrasi data dengan **PostgreSQL**.

## 🛠️ Modul Tersedia

- **Products**: Pengelolaan data produk dan varian (Katalog, Manajemen Stok).
- **Customers**: Pengelolaan data pelanggan (Termasuk sistem "Kuota" kiloan khusus Laundry).
- **Orders**: Penanganan pemesanan *real-time*, utamanya digunakan oleh *Kitchen Display System* (KDS) dan pesanan via QR Menu Resto. Mendukung status (*Cooking, Ready, dll*).
- **Transactions**: Perekaman bukti transaksi dari Kasir (POS) maupun pembayaran di aplikasi, termasuk pelacakan status hutang (*IsDebt*).

## 🗄️ Database
KasirKu API menggunakan **TypeORM** untuk sinkronisasi model entitas secara langsung ke database **PostgreSQL**.
Secara otomatis, semua entitas seperti `Product`, `Customer`, `Order`, dan `Transaction` akan disinkronisasikan (*synchronize: true* untuk tahap development).

## 🚀 Instalasi & Menjalankan Aplikasi

Pastikan Anda berada di dalam *directory* `apps/api` dan database PostgreSQL (via Docker) sudah berjalan di `localhost:5435`.

```bash
# Instalasi dependensi
$ npm install

# Menjalankan dalam mode development (dengan Hot Reload)
$ npm run start:dev

# Menjalankan dalam mode production
$ npm run build
$ npm run start:prod
```

Server akan aktif secara otomatis pada `http://localhost:3005`.

## 📌 Endpoint Utama (Contoh)

- `GET /products` - Mengambil katalog produk.
- `POST /orders` - Membuat pesanan baru (dari QR Menu).
- `GET /orders/kitchen` - Mengambil pesanan berstatus *Pending* dan *Cooking* untuk Dapur.
- `GET /orders/queue/public` - Mengambil pesanan untuk Layar Antrean Publik.
- `POST /transactions` - Merekam transaksi yang sudah diselesaikan dari Kasir.

---
*Dikembangkan dengan ❤️ menggunakan NestJS untuk KasirKu Monorepo.*
