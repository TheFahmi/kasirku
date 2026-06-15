# KasirKu

Aplikasi Kasir (Point of Sale) modern, cepat, dan 100% offline. Didesain untuk kemudahan penggunaan di perangkat apa pun tanpa perlu terhubung ke internet.

## Fitur Utama
* **100% Offline:** Berjalan murni di sisi browser (Local Storage).
* **Single File Build:** Tidak butuh server, cukup buka 1 file HTML dan aplikasi langsung jalan.
* **Keamanan Data:** Fitur backup dan restore data yang dienkripsi secara aman menggunakan sandi akun (AES-GCM).
* **Modern Stack:** Dibangun menggunakan Vanilla JavaScript (ES Modules) dan di-bundle menggunakan Vite.

---

## 🚀 Panduan Instalasi & Pengembangan (Development)

Jika Anda ingin mengedit kode atau mengembangkan fitur baru:

1. **Pastikan Anda memiliki Node.js terinstal.**
2. Clone repository ini:
   ```bash
   git clone https://github.com/TheFahmi/kasirku.git
   cd kasirku
   ```
3. Install dependensi (Vite dkk):
   ```bash
   npm install
   ```
4. Jalankan *Development Server*:
   ```bash
   npm run dev
   ```
5. Buka browser dan akses alamat yang tertera di terminal (biasanya `http://localhost:5173`). Setiap kali Anda mengedit file di folder `src/`, tampilan di browser akan otomatis diperbarui.

---

## 📦 Panduan Build untuk Produksi (Mode Offline)

Karena aplikasi ini dirancang khusus untuk bisa di-klik ganda dan jalan tanpa server (protokol `file://`), Anda harus mem-build aplikasi ini sebelum didistribusikan.

1. Jalankan perintah build:
   ```bash
   npm run build
   ```
2. Vite akan mengkompresi semua JavaScript dan CSS, lalu menyatukannya ke dalam satu file HTML melalui `vite-plugin-singlefile`.
3. Buka folder **`dist`**.
4. **Selesai!** Anda hanya butuh file **`dist/index.html`** untuk menjalankan aplikasi. Tinggal klik dua kali file tersebut, dan aplikasi KasirKu siap digunakan sepenuhnya tanpa internet!

---

## Deploy ke Server (Opsional)
Jika Anda ingin aplikasi ini bisa diakses orang lain secara online:
* Cukup unggah (upload) file `index.html` yang ada di dalam folder `dist/` ke layanan hosting apa pun (Vercel, Netlify, GitHub Pages, atau folder `public_html` di Shared Hosting).
* Tidak perlu mengunggah folder `node_modules` atau `src`.
