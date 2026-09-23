import { Database } from "bun:sqlite";
import { file as bunFile } from "bun";

// Inisialisasi Database SQLite persisten
const db = new Database("jobtrack.db", { create: true });

// Buat skema tabel `users`, `sessions`, dan `jobs`
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    status TEXT NOT NULL,
    work_type TEXT,
    location TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    applied_date TEXT,
    follow_up_date TEXT,
    job_url TEXT,
    notes TEXT,
    timeline TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

export async function seedDemoUserAndJobs() {
  const userCheck = db.prepare("SELECT * FROM users WHERE email = ?").get("demo@jobtrack.io");
  let userId;

  if (!userCheck) {
    userId = "user-demo-100";
    const passwordHash = await Bun.password.hash("password123", { algorithm: "argon2id", memoryCost: 65536, timeCost: 2 });
    db.prepare("INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)").run(userId, "Demo User", "demo@jobtrack.io", passwordHash);
  } else {
    userId = userCheck.id;
  }

  const jobsCount = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE user_id = ?").get(userId).count;
  if (jobsCount === 0) {
    const insertJob = db.prepare(`
      INSERT INTO jobs (id, user_id, company, position, status, work_type, location, salary_min, salary_max, applied_date, follow_up_date, job_url, notes, timeline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const sampleJobs = [
      {
        id: "job-101",
        company: "Tokopedia / GoTo",
        position: "Senior Frontend Engineer (React)",
        status: "Offer",
        work_type: "Hybrid",
        location: "Jakarta, Indonesia",
        salary_min: 28000000,
        salary_max: 35000000,
        applied_date: "2026-08-15",
        follow_up_date: "2026-09-24",
        job_url: "https://www.linkedin.com/jobs/view/101",
        notes: "Sudah lulus Technical Interview & HR Negotiation. Offer letter terbit tanggal 20 Sep. Menunggu konfirmasi sign.",
        timeline: JSON.stringify([
          { date: "2026-08-15", status: "Applied", note: "Submit via LinkedIn" },
          { date: "2026-08-22", status: "Screening", note: "HR Call 30 menit" },
          { date: "2026-09-02", status: "Interview", note: "Live Coding & System Design" },
          { date: "2026-09-20", status: "Offer", note: "Menerima Offer Letter" }
        ])
      },
      {
        id: "job-102",
        company: "Traveloka",
        position: "Full Stack Engineer (Node + React)",
        status: "Interview",
        work_type: "Hybrid",
        location: "BSD City, Tangerang",
        salary_min: 22000000,
        salary_max: 28000000,
        applied_date: "2026-09-01",
        follow_up_date: "2026-09-25",
        job_url: "https://traveloka.com/careers",
        notes: "User Interview tanggal 25 Sep jam 14.00 WIB. Pelajari arsitektur mikro-frontend dan Caching Redis.",
        timeline: JSON.stringify([
          { date: "2026-09-01", status: "Applied", note: "Submit via Website Careers" },
          { date: "2026-09-10", status: "Screening", note: "Take home test diselesaikan" },
          { date: "2026-09-18", status: "Interview", note: "Undangan User Interview" }
        ])
      },
      {
        id: "job-103",
        company: "Grab Indonesia",
        position: "Lead UI/UX Engineer",
        status: "Screening",
        work_type: "Remote",
        location: "Remote (Singapore HQ)",
        salary_min: 32000000,
        salary_max: 40000000,
        applied_date: "2026-09-12",
        follow_up_date: "2026-09-26",
        job_url: "https://grab.careers",
        notes: "HR recruiter kontak via email. Diminta mengirimkan link portfolio Design System.",
        timeline: JSON.stringify([
          { date: "2026-09-12", status: "Applied", note: "Submit via Referral" },
          { date: "2026-09-19", status: "Screening", note: "Email dari Recruiter" }
        ])
      }
    ];

    for (const job of sampleJobs) {
      insertJob.run(
        job.id,
        userId,
        job.company,
        job.position,
        job.status,
        job.work_type,
        job.location,
        job.salary_min,
        job.salary_max,
        job.applied_date,
        job.follow_up_date,
        job.job_url,
        job.notes,
        job.timeline
      );
    }
  }
}

await seedDemoUserAndJobs();

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

function getAuthenticatedUser(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.replace("Bearer ", "").trim();
  const session = db.prepare("SELECT s.token, u.id, u.name, u.email FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ?").get(token);
  return session || null;
}

export async function handleApiRequest(req) {
  const url = new URL(req.url);
  const method = req.method;

  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }

  // Health check
  if (url.pathname === "/api/health") {
    return jsonResponse({ status: "ok", database: "SQLite", engine: "bun:sqlite", auth: "Argon2id" });
  }

  // POST /api/auth/register
  if (url.pathname === "/api/auth/register" && method === "POST") {
    try {
      const { name, email, password } = await req.json();
      if (!name || !email || !password) {
        return jsonResponse({ success: false, error: "Nama, email, dan password wajib diisi" }, 400);
      }

      if (password.length < 6) {
        return jsonResponse({ success: false, error: "Password minimal 6 karakter" }, 400);
      }

      const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
      if (existingUser) {
        return jsonResponse({ success: false, error: "Email sudah terdaftar. Silakan login." }, 400);
      }

      const userId = `user-${Date.now()}`;
      const passwordHash = await Bun.password.hash(password, { algorithm: "argon2id", memoryCost: 65536, timeCost: 2 });

      db.prepare("INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)").run(userId, name, email, passwordHash);

      const token = `token-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      db.prepare("INSERT INTO sessions (token, user_id) VALUES (?, ?)").run(token, userId);

      return jsonResponse({
        success: true,
        message: "Registrasi berhasil",
        token,
        user: { id: userId, name, email }
      }, 201);

    } catch (err) {
      return jsonResponse({ success: false, error: err.message }, 500);
    }
  }

  // POST /api/auth/login
  if (url.pathname === "/api/auth/login" && method === "POST") {
    try {
      const { email, password } = await req.json();
      if (!email || !password) {
        return jsonResponse({ success: false, error: "Email dan password wajib diisi" }, 400);
      }

      const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
      if (!user) {
        return jsonResponse({ success: false, error: "Email atau password salah." }, 401);
      }

      const isValidPassword = await Bun.password.verify(password, user.password_hash);
      if (!isValidPassword) {
        return jsonResponse({ success: false, error: "Email atau password salah." }, 401);
      }

      const token = `token-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      db.prepare("INSERT INTO sessions (token, user_id) VALUES (?, ?)").run(token, user.id);

      return jsonResponse({
        success: true,
        message: "Login berhasil",
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });

    } catch (err) {
      return jsonResponse({ success: false, error: err.message }, 500);
    }
  }

  // GET /api/auth/me
  if (url.pathname === "/api/auth/me" && method === "GET") {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }
    return jsonResponse({ success: true, user: { id: user.id, name: user.name, email: user.email } });
  }

  // POST /api/auth/logout
  if (url.pathname === "/api/auth/logout" && method === "POST") {
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "").trim();
      db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    }
    return jsonResponse({ success: true, message: "Logout berhasil" });
  }

  // --- PROTECTED JOBS ENDPOINTS ---
  const currentUser = getAuthenticatedUser(req);

  // GET /api/jobs
  if (url.pathname === "/api/jobs" && method === "GET") {
    if (!currentUser) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    const stmt = db.prepare("SELECT * FROM jobs WHERE user_id = ? ORDER BY datetime(created_at) DESC");
    const rows = stmt.all(currentUser.id);
    const jobs = rows.map(r => ({
      id: r.id,
      company: r.company,
      position: r.position,
      status: r.status,
      workType: r.work_type,
      location: r.location,
      salaryMin: r.salary_min,
      salaryMax: r.salary_max,
      appliedDate: r.applied_date,
      followUpDate: r.follow_up_date,
      jobUrl: r.job_url,
      notes: r.notes,
      timeline: r.timeline ? JSON.parse(r.timeline) : []
    }));
    return jsonResponse({ success: true, count: jobs.length, data: jobs });
  }

  // POST /api/jobs (Create)
  if (url.pathname === "/api/jobs" && method === "POST") {
    if (!currentUser) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    try {
      const body = await req.json();
      if (!body.company || !body.position) {
        return jsonResponse({ success: false, error: "Nama perusahaan dan posisi wajib diisi" }, 400);
      }

      const id = body.id || `job-${Date.now()}`;
      const timeline = JSON.stringify(body.timeline || [
        { date: new Date().toISOString().split('T')[0], status: body.status || 'Applied', note: 'Lamaran dibuat' }
      ]);

      const stmt = db.prepare(`
        INSERT INTO jobs (id, user_id, company, position, status, work_type, location, salary_min, salary_max, applied_date, follow_up_date, job_url, notes, timeline)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        currentUser.id,
        body.company,
        body.position,
        body.status || 'Applied',
        body.workType || 'Remote',
        body.location || '',
        body.salaryMin || null,
        body.salaryMax || null,
        body.appliedDate || new Date().toISOString().split('T')[0],
        body.followUpDate || '',
        body.jobUrl || '',
        body.notes || '',
        timeline
      );

      return jsonResponse({ success: true, message: "Lamaran berhasil disimpan", id }, 201);
    } catch (err) {
      console.error("POST /api/jobs error:", err);
      return jsonResponse({ success: false, error: err.message }, 500);
    }
  }

  // PUT /api/jobs/:id (Update)
  if (url.pathname.startsWith("/api/jobs/") && method === "PUT") {
    if (!currentUser) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    const id = url.pathname.replace("/api/jobs/", "");
    try {
      const body = await req.json();
      const timeline = JSON.stringify(body.timeline || []);

      const stmt = db.prepare(`
        UPDATE jobs SET 
          company = ?,
          position = ?,
          status = ?,
          work_type = ?,
          location = ?,
          salary_min = ?,
          salary_max = ?,
          applied_date = ?,
          follow_up_date = ?,
          job_url = ?,
          notes = ?,
          timeline = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `);

      stmt.run(
        body.company,
        body.position,
        body.status,
        body.workType,
        body.location,
        body.salaryMin || null,
        body.salaryMax || null,
        body.appliedDate,
        body.followUpDate,
        body.jobUrl,
        body.notes,
        timeline,
        id,
        currentUser.id
      );

      return jsonResponse({ success: true, message: "Lamaran berhasil diperbarui" });
    } catch (err) {
      return jsonResponse({ success: false, error: err.message }, 500);
    }
  }

  // DELETE /api/jobs/:id
  if (url.pathname.startsWith("/api/jobs/") && method === "DELETE") {
    if (!currentUser) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    const id = url.pathname.replace("/api/jobs/", "");
    try {
      const stmt = db.prepare("DELETE FROM jobs WHERE id = ? AND user_id = ?");
      stmt.run(id, currentUser.id);
      return jsonResponse({ success: true, message: "Lamaran berhasil dihapus" });
    } catch (err) {
      return jsonResponse({ success: false, error: err.message }, 500);
    }
  }

  // POST /api/jobs/reset
  if (url.pathname === "/api/jobs/reset" && method === "POST") {
    if (!currentUser) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    db.prepare("DELETE FROM jobs WHERE user_id = ?").run(currentUser.id);
    await seedDemoUserAndJobs();
    return jsonResponse({ success: true, message: "Database berhasil di-reset" });
  }

  return jsonResponse({ error: "Endpoint not found" }, 404);
}

// Start Unified Production & API Server
if (import.meta.main) {
  const PORT = process.env.PORT || 3005;
  Bun.serve({
    port: PORT,
    hostname: "0.0.0.0",
    async fetch(req) {
      const url = new URL(req.url);

      if (url.pathname.startsWith("/api/")) {
        return handleApiRequest(req);
      }

      let filePath = `./dist${url.pathname}`;
      if (url.pathname === "/") {
        filePath = "./dist/index.html";
      }

      const staticFile = bunFile(filePath);
      if (await staticFile.exists()) {
        return new Response(staticFile);
      }

      const indexHtml = bunFile("./dist/index.html");
      if (await indexHtml.exists()) {
        return new Response(indexHtml);
      }

      return new Response("Not found", { status: 404 });
    }
  });
  console.log(`🚀 JobTrack Production Server (API + Frontend) berjalan di http://0.0.0.0:${PORT}`);
}
