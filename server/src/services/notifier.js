import nodemailer from "nodemailer";

function noOpNotifier() {
  return {
    enabled: false,
    async reportCreated() {},
    async reportResolved() {},
  };
}

export function createNotifier(config, { transport } = {}) {
  if (!config.enabled) return noOpNotifier();

  const transporter =
    transport ||
    nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      ...(config.user
        ? { auth: { user: config.user, pass: config.password } }
        : {}),
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
      disableFileAccess: true,
      disableUrlAccess: true,
    });

  return {
    enabled: true,

    async reportCreated({ report, reporter }) {
      if (!config.adminRecipients.length) return;
      await transporter.sendMail({
        from: config.from,
        to: config.adminRecipients,
        subject: `[Tunza SU] New ${report.priority} priority report`,
        text: [
          `A new maintenance report was submitted by ${reporter?.name || "a student"}.`,
          `Title: ${report.title}`,
          `Category: ${report.category}`,
          `Priority: ${report.priority}`,
          `Location: ${report.location}`,
          `Report ID: ${report.id}`,
        ].join("\n"),
      });
    },

    async reportResolved({ report }) {
      if (!report?.reporter_email) return;
      await transporter.sendMail({
        from: config.from,
        to: report.reporter_email,
        subject: `[Tunza SU] Report #${report.id} resolved`,
        text: [
          `Hello ${report.reporter_name || "there"},`,
          "",
          "Your maintenance report has been marked as resolved.",
          `Title: ${report.title}`,
          `Location: ${report.location}`,
          `Report ID: ${report.id}`,
        ].join("\n"),
      });
    },
  };
}
