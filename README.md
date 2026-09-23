# 💼 JobTrack — Professional Job Application Tracker & Analytics

**JobTrack** adalah aplikasi web fullstack modern dan minimalis untuk memantau, mengelola, dan menganalisis lamaran pekerjaan secara efektif. Dibangun dengan **React**, **Vite**, **Bun**, **SQLite**, dan standar keamanan autentikasi **Argon2id Memory Hashing**.

---

## ✨ Fitur Utama

- 🔒 **Sistem Keamanan Standar Industri (Argon2id)**: Password di-hash menggunakan algoritma `Argon2id` (standar kriptografi tertinggi untuk otentikasi) dan sesi JWT/Bearer Token.
- 🗄️ **SQLite Native Database (`bun:sqlite`)**: Penyimpanan data persisten lokal di `jobtrack.db` yang cepat, aman, dan terisolasi per akun user.
- 📊 **Executive Analytics Dashboard**: Metrik real-time (*Total Applications, Active Pipeline, Offers, Win Rate %, Response Rate %*) serta *Funnel Progress Breakdown Bar*.
- 🔀 **Dual View Interface**:
  - **Kanban Board**: Kolom status (`Wishlist`, `Applied`, `Screening`, `Interview`, `Offer`, `Rejected`) dengan kartu interaktif dan pemindahan status cepat.
  - **Data Table**: Tabel ringkas dengan search bar instan, filter lokasi/tipe kerja, dan pengurutan data.
- 📋 **Interview Prep & Checklist Master**: Templat checklist persiapan HR & Technical Interview per perusahaan target.
- 🎨 **Solid Color Minimalist UI**: Desain antarmuka bersih tanpa gradien, kontras tinggi, tema Light/Dark Mode toggle, dan Floating Action Button (`+`).
- 🎉 **Selebrasi Confetti**: Efek selebrasi otomatis saat status lamaran mencapai **Offer**.

---

## 🛠️ Tech Stack

- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Frontend**: React 19, Lucide Icons, Canvas Confetti
- **Backend API**: Bun HTTP Server (`server.js`)
- **Database Engine**: `bun:sqlite` (SQLite 3)
- **Security & Cryptography**: `Bun.password` (Argon2id)
- **Testing**: `bun test`

---

## 🚀 Panduan Memulai (Quick Start)

### 1. Prasyarat
Pastikan [Bun](https://bun.sh/) sudah terinstal di peranti Anda.

### 2. Install Dependensi
```bash
bun install
```

### 3. Menjalankan Backend API & Dev Server
```bash
# Jalankan API Server SQLite Backend (Port 3001)
bun server.js

# Menjalankan Dev Server Frontend (Port 3000)
bun dev
```

Akses aplikasi di browser pada **http://localhost:3000/**.

---

## 🧪 Menjalankan Automated Unit Tests

Aplikasi dilengkapi dengan pengujian unit otomatis untuk REST API dan Autentikasi Argon2id:

```bash
bun test
```

### Output Pengujian:
```text
server.test.js:
✓ GET /api/health - status OK & info SQLite database
✓ POST /api/auth/register - registrasi user dengan Argon2id
✓ POST /api/auth/login - verifikasi password Argon2id
✓ POST /api/auth/login - menolak password salah
✓ GET /api/auth/me - check user session
✓ GET /api/jobs - fetch data lamaran user
✓ POST /api/jobs - tambah lamaran baru

 7 pass, 0 fail (393ms)
```

---

## 📚 Dokumentasi API

Lihat rincian spesifikasi REST API pada file [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

---

## 📝 Lisensi

Licensed under the [MIT License](./LICENSE).
