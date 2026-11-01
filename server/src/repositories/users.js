const publicColumns = `
  id, name, email, admission_number, phone_number, role, created_at, updated_at
`;

export function createUserRepository(db) {
  return {
    async findByIdentity(email, admissionNumber) {
      const [rows] = await db.execute(
        `SELECT * FROM users2
         WHERE (? IS NOT NULL AND email = ?)
            OR (? IS NOT NULL AND admission_number = ?)
         LIMIT 1`,
        [email || null, email || null, admissionNumber || null, admissionNumber || null]
      );
      return rows[0] || null;
    },

    async findByEmail(email) {
      const [rows] = await db.execute(
        "SELECT * FROM users2 WHERE email = ? LIMIT 1",
        [email]
      );
      return rows[0] || null;
    },

    async findPublicById(id) {
      const [rows] = await db.execute(
        `SELECT ${publicColumns} FROM users2 WHERE id = ? LIMIT 1`,
        [id]
      );
      return rows[0] || null;
    },

    async createPasswordUser({ name, email, admissionNumber, password, phoneNumber }) {
      const [result] = await db.execute(
        `INSERT INTO users2
          (name, email, admission_number, password, phone_number, role)
         VALUES (?, ?, ?, ?, ?, 'student')`,
        [name, email, admissionNumber, password, phoneNumber]
      );
      return this.findPublicById(result.insertId);
    },

    async createGoogleUser({ name, email, subject }) {
      const admissionNumber = `GGL-${subject}`.slice(0, 50);
      const [result] = await db.execute(
        `INSERT INTO users2
          (name, email, admission_number, google_subject, role)
         VALUES (?, ?, ?, ?, 'student')`,
        [name, email, admissionNumber, subject]
      );
      return this.findPublicById(result.insertId);
    },

    async linkGoogleIdentity(id, subject) {
      const [result] = await db.execute(
        `UPDATE users2
         SET google_subject = ?
         WHERE id = ? AND (google_subject IS NULL OR google_subject = ?)`,
        [subject, id, subject]
      );
      if (result.affectedRows === 0) return null;
      return this.findPublicById(id);
    },

    async list() {
      const [rows] = await db.execute(
        `SELECT ${publicColumns} FROM users2 ORDER BY created_at DESC`
      );
      return rows;
    },

    async createPrivilegedUser({ name, email, admissionNumber, password, phoneNumber, role }) {
      const [result] = await db.execute(
        `INSERT INTO users2
          (name, email, admission_number, password, phone_number, role)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, admissionNumber, password, phoneNumber, role]
      );
      return this.findPublicById(result.insertId);
    },

    async delete(id) {
      const [result] = await db.execute("DELETE FROM users2 WHERE id = ?", [id]);
      return result.affectedRows > 0;
    },
  };
}
