import { createUserRepository } from "./users.js";
import { createReportRepository } from "./reports.js";

export function createRepositories(db) {
  return {
    users: createUserRepository(db),
    reports: createReportRepository(db),
  };
}
