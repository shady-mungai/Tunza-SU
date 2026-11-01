export function createReportRepository(db) {
  return {
    async create(report) {
      const [result] = await db.execute(
        `INSERT INTO reports2
          (user_id, title, description, location, category, priority, status,
           image_url, image_key, assigned_to, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, NULL, NOW(), NOW())`,
        [
          report.userId,
          report.title,
          report.description,
          report.location,
          report.category,
          report.priority,
          report.imageUrl,
          report.imageKey,
        ]
      );
      return { id: result.insertId };
    },

    async listByUser(userId) {
      const [rows] = await db.execute(
        "SELECT * FROM reports2 WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
      );
      return rows;
    },

    async listAssigned(maintenanceId) {
      const [rows] = await db.execute(
        `SELECT r.*, u.name AS reporter_name, u.email AS reporter_email
         FROM reports2 r
         LEFT JOIN users2 u ON r.user_id = u.id
         WHERE r.assigned_to = ?
         ORDER BY r.created_at DESC`,
        [maintenanceId]
      );
      return rows;
    },

    async findById(id) {
      const [rows] = await db.execute(
        "SELECT * FROM reports2 WHERE id = ? LIMIT 1",
        [id]
      );
      return rows[0] || null;
    },

    async findDetailedById(id) {
      const [rows] = await db.execute(
        `SELECT r.*, u.name AS reporter_name, u.email AS reporter_email
         FROM reports2 r
         LEFT JOIN users2 u ON r.user_id = u.id
         WHERE r.id = ?
         LIMIT 1`,
        [id]
      );
      return rows[0] || null;
    },

    async delete(id) {
      const [result] = await db.execute("DELETE FROM reports2 WHERE id = ?", [id]);
      return result.affectedRows > 0;
    },

    async updateStatus(id, status) {
      const [result] = await db.execute(
        `UPDATE reports2
         SET status = ?, updated_at = NOW(),
             completed_at = CASE WHEN ? = 'resolved' THEN NOW() ELSE completed_at END
         WHERE id = ?`,
        [status, status, id]
      );
      return result.affectedRows > 0;
    },

    async assign(id, maintenanceId) {
      const [result] = await db.execute(
        `UPDATE reports2
         SET assigned_to = ?, status = 'in_progress', updated_at = NOW()
         WHERE id = ?`,
        [maintenanceId, id]
      );
      return result.affectedRows > 0;
    },

    async stats() {
      const [rows] = await db.execute(
        `SELECT
           SUM(status = 'in_progress') AS activeReports,
           SUM(status = 'resolved') AS resolvedReports,
           SUM(status = 'pending') AS pendingReports
         FROM reports2`
      );
      return {
        activeReports: Number(rows[0]?.activeReports || 0),
        resolvedReports: Number(rows[0]?.resolvedReports || 0),
        pendingReports: Number(rows[0]?.pendingReports || 0),
      };
    },

    async listActive() {
      const [rows] = await db.execute(
        `SELECT r.*, u.name AS submittedBy, assignee.name AS assignedTo
         FROM reports2 r
         LEFT JOIN users2 u ON r.user_id = u.id
         LEFT JOIN users2 assignee ON r.assigned_to = assignee.id
         WHERE r.status IN ('pending', 'in_progress')
         ORDER BY r.created_at DESC`
      );
      return rows;
    },
  };
}
