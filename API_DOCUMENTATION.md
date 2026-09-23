# JobTrack REST API Documentation

Dokumentasi resmi untuk **JobTrack REST API Backend** yang didukung oleh **Bun Native SQLite Database (`bun:sqlite`)**.

- **Base URL**: `http://127.0.0.1:3001` (atau `/api` melalui Proxy Frontend)
- **Format Response**: JSON (`application/json`)
- **Database Engine**: SQLite 3 (`jobtrack.db`)

---

## Ringkasan Endpoints

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Mengecek status server & kesehatan koneksi SQLite |
| `GET` | `/api/jobs` | Mengambil seluruh daftar lamaran pekerjaan beserta timeline |
| `POST` | `/api/jobs` | Membuat data lamaran baru ke SQLite Database |
| `PUT` | `/api/jobs/:id` | Memperbarui rincian atau status lamaran berdasarkan ID |
| `DELETE` | `/api/jobs/:id` | Menghapus data lamaran dari SQLite Database |
| `POST` | `/api/jobs/reset` | Re-seed database ke sampel data lamaran awal |

---

## Detailed Endpoint Specifications

### 1. Health Check
Mengecek apakah API Server dan SQLite Database berjalan dengan baik.

- **URL**: `/api/health`
- **Method**: `GET`
- **Example Response (200 OK)**:
```json
{
  "status": "ok",
  "database": "SQLite",
  "engine": "bun:sqlite"
}
```

---

### 2. Get All Applications
Mengambil semua data lamaran pekerjaan secara terurut dari yang terbaru.

- **URL**: `/api/jobs`
- **Method**: `GET`
- **Example Response (200 OK)**:
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": "job-101",
      "company": "Tokopedia / GoTo",
      "position": "Senior Frontend Engineer (React)",
      "status": "Offer",
      "workType": "Hybrid",
      "location": "Jakarta, Indonesia",
      "salaryMin": 28000000,
      "salaryMax": 35000000,
      "appliedDate": "2026-08-15",
      "followUpDate": "2026-09-24",
      "jobUrl": "https://www.linkedin.com/jobs/view/101",
      "notes": "Sudah lulus Technical Interview & HR Negotiation.",
      "timeline": [
        { "date": "2026-08-15", "status": "Applied", "note": "Submit via LinkedIn" },
        { "date": "2026-09-20", "status": "Offer", "note": "Menerima Offer Letter" }
      ]
    }
  ]
}
```

---

### 3. Create Application
Menambahkan lamaran baru ke SQLite database.

- **URL**: `/api/jobs`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "company": "Tech Corp",
  "position": "Senior React Developer",
  "status": "Applied",
  "workType": "Remote",
  "location": "Jakarta",
  "salaryMin": 25000000,
  "salaryMax": 30000000,
  "appliedDate": "2026-09-23",
  "followUpDate": "2026-09-30",
  "jobUrl": "https://techcorp.com/careers",
  "notes": "Apply via Website Resmi"
}
```
- **Example Response (201 Created)**:
```json
{
  "success": true,
  "message": "Lamaran berhasil disimpan",
  "id": "job-1727059200000"
}
```
- **Validation Error (400 Bad Request)**:
```json
{
  "success": false,
  "error": "Nama perusahaan dan posisi wajib diisi"
}
```

---

### 4. Update Application
Memperbarui lamaran yang sudah ada berdasarkan `id`.

- **URL**: `/api/jobs/:id`
- **Method**: `PUT`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "company": "Tech Corp",
  "position": "Senior React Developer",
  "status": "Interview",
  "workType": "Remote",
  "location": "Jakarta",
  "salaryMin": 28000000,
  "salaryMax": 32000000,
  "appliedDate": "2026-09-23",
  "followUpDate": "2026-09-30",
  "jobUrl": "https://techcorp.com/careers",
  "notes": "User Interview tanggal 30 Sep jam 10:00 WIB",
  "timeline": [
    { "date": "2026-09-23", "status": "Applied", "note": "Submit" },
    { "date": "2026-09-24", "status": "Interview", "note": "Invited to User Interview" }
  ]
}
```
- **Example Response (200 OK)**:
```json
{
  "success": true,
  "message": "Lamaran berhasil diperbarui"
}
```

---

### 5. Delete Application
Menghapus lamaran dari SQLite database berdasarkan `id`.

- **URL**: `/api/jobs/:id`
- **Method**: `DELETE`
- **Example Response (200 OK)**:
```json
{
  "success": true,
  "message": "Lamaran berhasil dihapus"
}
```

---

### 6. Reset Database
Menghapus seluruh baris data dan mengisi ulang dengan sampel data bawaan.

- **URL**: `/api/jobs/reset`
- **Method**: `POST`
- **Example Response (200 OK)**:
```json
{
  "success": true,
  "message": "Database berhasil di-reset"
}
```

---

## 🧪 Menjalankan Automated Unit Tests

Aplikasi menggunakan **Bun Test Runner**. Untuk menguji seluruh endpoint API:

```bash
bun test
```

### Hasil pengujian:
```text
server.test.js:
✓ GET /api/health - harus mengembalikan status OK dan SQLite info
✓ GET /api/jobs - harus mengembalikan daftar lamaran pekerjaan
✓ POST /api/jobs - harus menambah lamaran baru ke SQLite Database
✓ POST /api/jobs - harus menolak jika company atau position kosong
✓ PUT /api/jobs/:id - harus memperbarui data lamaran
✓ DELETE /api/jobs/:id - harus menghapus lamaran dari SQLite Database
✓ POST /api/jobs/reset - harus meng-reset database ke sampel awal

 7 pass, 0 fail (60ms)
```
