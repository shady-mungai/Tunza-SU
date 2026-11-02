const apiUrl = process.env.SMOKE_API_URL?.replace(/\/$/, "");
const adminEmail = process.env.SMOKE_ADMIN_EMAIL?.trim();
const adminPassword = process.env.SMOKE_ADMIN_PASSWORD;
const allowHttp = process.env.SMOKE_ALLOW_HTTP === "true";

if (!apiUrl || !adminEmail || !adminPassword) {
  throw new Error(
    "SMOKE_API_URL, SMOKE_ADMIN_EMAIL, and SMOKE_ADMIN_PASSWORD are required",
  );
}
if (!apiUrl.startsWith("https://") && !(allowHttp && apiUrl.startsWith("http://"))) {
  throw new Error(
    "SMOKE_API_URL must use HTTPS (set SMOKE_ALLOW_HTTP=true only for disposable local checks)",
  );
}

const suffix = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
const password = `Smoke-${suffix}-A9!`;
const createdUserIds = [];
let reportId;
let adminToken;
let passedChecks = 0;

async function request(path, { token, expected = 200, ...options } = {}) {
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    options.body = JSON.stringify(options.body);
  }
  const response = await fetch(`${apiUrl}${path}`, { ...options, headers });
  const body = await response.json().catch(() => null);
  if (response.status !== expected) {
    throw new Error(
      `${options.method || "GET"} ${path}: expected ${expected}, received ${response.status} ${JSON.stringify(body)}`,
    );
  }
  return body;
}

function record(name, details = {}) {
  passedChecks += 1;
  console.log(JSON.stringify({ check: name, status: "passed", ...details }));
}

try {
  await request("/health");
  record("health");
  await request("/ready");
  record("readiness");

  const admin = await request("/login", {
    method: "POST",
    body: { email: adminEmail, password: adminPassword },
  });
  adminToken = admin.accessToken;
  record("admin_login");

  const student = await request("/register", {
    method: "POST",
    expected: 201,
    body: {
      name: "Release Smoke Student",
      email: `student-${suffix}@example.invalid`,
      admission_number: `SMOKE-STUDENT-${suffix}`.slice(0, 50),
      phone_number: "+254700000001",
      password,
    },
  });
  createdUserIds.push(student.user.id);
  record("student_registration");

  await request("/auth/me", { token: student.accessToken });
  record("session_validation");

  const staff = [];
  for (const label of ["assigned", "unassigned"]) {
    const result = await request("/users", {
      token: adminToken,
      method: "POST",
      expected: 201,
      body: {
        name: `Release Smoke ${label} Staff`,
        email: `${label}-${suffix}@example.invalid`,
        admission_number: `SMOKE-${label}-${suffix}`.slice(0, 50),
        phone_number: label === "assigned" ? "+254700000002" : "+254700000003",
        password,
        role: "maintenance_staff",
      },
    });
    createdUserIds.push(result.user.id);
    const session = await request("/login", {
      method: "POST",
      body: { email: result.user.email, password },
    });
    staff.push({ ...result.user, token: session.accessToken });
  }
  record("staff_provisioning");

  const form = new FormData();
  form.set("title", "Release smoke report");
  form.set("description", "Disposable end-to-end verification report");
  form.set("location", "Release verification area");
  form.set("category", "Other");
  form.set("priority", "medium");
  const report = await request("/addReport", {
    token: student.accessToken,
    method: "POST",
    expected: 201,
    body: form,
  });
  reportId = report.report.id;
  record("report_submission", { reportId });

  const studentReports = await request("/userReports", {
    token: student.accessToken,
  });
  if (!studentReports.reports.some((item) => item.id === reportId)) {
    throw new Error("Student report was not returned by /userReports");
  }
  record("student_report_visibility");

  await request(`/reports/${reportId}/assignment`, {
    token: adminToken,
    method: "PUT",
    body: { maintenance_id: staff[0].id },
  });
  const assignedReports = await request("/assignedReports", {
    token: staff[0].token,
  });
  if (!assignedReports.reports.some((item) => item.id === reportId)) {
    throw new Error("Assigned report was not returned to maintenance staff");
  }
  record("report_assignment");

  await request(`/reports/${reportId}`, {
    token: staff[1].token,
    method: "PUT",
    expected: 403,
    body: { status: "resolved" },
  });
  record("unassigned_staff_denied");

  await request(`/reports/${reportId}`, {
    token: staff[0].token,
    method: "PUT",
    body: { status: "resolved" },
  });
  const resolvedReports = await request("/userReports", {
    token: student.accessToken,
  });
  const resolved = resolvedReports.reports.find((item) => item.id === reportId);
  if (resolved?.status !== "resolved") {
    throw new Error("Resolved status was not visible to the reporting student");
  }
  record("assigned_status_update");

  console.log(JSON.stringify({ result: "passed", checks: passedChecks }));
} finally {
  if (adminToken && reportId) {
    await request(`/report/${reportId}`, {
      token: adminToken,
      method: "DELETE",
    }).catch((error) => console.error(`Cleanup warning: ${error.message}`));
  }
  if (adminToken) {
    for (const id of [...createdUserIds].reverse()) {
      await request(`/user/${id}`, {
        token: adminToken,
        method: "DELETE",
      }).catch((error) => console.error(`Cleanup warning: ${error.message}`));
    }
  }
}
