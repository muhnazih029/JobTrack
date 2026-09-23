import { describe, expect, test } from "bun:test";
import { handleApiRequest } from "./server.js";

describe("JobTrack SQLite REST API & Argon2id Auth Tests", () => {
  let authToken = "";
  const testEmail = `testuser-${Date.now()}@jobtrack.io`;
  const testPassword = "securePassword123!";

  test("GET /api/health - harus mengembalikan status OK, SQLite, dan info Argon2id", async () => {
    const req = new Request("http://localhost:3001/api/health");
    const res = await handleApiRequest(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe("ok");
    expect(json.database).toBe("SQLite");
    expect(json.auth).toBe("Argon2id");
  });

  test("POST /api/auth/register - harus meregistrasi user baru dengan Hashing Password Argon2id", async () => {
    const newUser = {
      name: "Test Engineer",
      email: testEmail,
      password: testPassword
    };

    const req = new Request("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });

    const res = await handleApiRequest(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.token).toBeDefined();
    expect(json.user.email).toBe(testEmail);

    authToken = json.token;
  });

  test("POST /api/auth/login - harus berhasil verifikasi password Argon2id dan menerbitkan token", async () => {
    const loginData = {
      email: testEmail,
      password: testPassword
    };

    const req = new Request("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData)
    });

    const res = await handleApiRequest(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.token).toBeDefined();

    authToken = json.token;
  });

  test("POST /api/auth/login - harus menolak jika password salah", async () => {
    const invalidLogin = {
      email: testEmail,
      password: "wrongPassword"
    };

    const req = new Request("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidLogin)
    });

    const res = await handleApiRequest(req);
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.success).toBe(false);
  });

  test("GET /api/auth/me - harus mengembalikan profil user terautentikasi", async () => {
    const req = new Request("http://localhost:3001/api/auth/me", {
      headers: { "Authorization": `Bearer ${authToken}` }
    });

    const res = await handleApiRequest(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.user.email).toBe(testEmail);
  });

  test("GET /api/jobs - harus mengembalikan data lamaran milik user terautentikasi", async () => {
    const req = new Request("http://localhost:3001/api/jobs", {
      headers: { "Authorization": `Bearer ${authToken}` }
    });

    const res = await handleApiRequest(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
  });

  test("POST /api/jobs - harus menambah lamaran baru untuk user terautentikasi", async () => {
    const newJob = {
      id: `job-auth-${Date.now()}`,
      company: "Secure Tech",
      position: "Lead Security Engineer",
      status: "Applied",
      workType: "Remote",
      location: "Jakarta",
      salaryMin: 35000000,
      salaryMax: 45000000
    };

    const req = new Request("http://localhost:3001/api/jobs", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(newJob)
    });

    const res = await handleApiRequest(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.success).toBe(true);
  });

});
