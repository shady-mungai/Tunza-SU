import { randomUUID } from "node:crypto";
import * as Sentry from "@sentry/node";

function serializeError(error, includeStack) {
  if (!error) return undefined;
  return {
    name: error.name || "Error",
    message: error.message || String(error),
    ...(includeStack && error.stack ? { stack: error.stack } : {}),
  };
}

export function createObservability(config) {
  if (config.dsn) {
    Sentry.init({
      dsn: config.dsn,
      environment: config.environment,
      release: config.release || undefined,
      sendDefaultPii: false,
      tracesSampleRate: config.tracesSampleRate,
    });
  }

  function write(level, event, fields = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      service: "tunza-su-api",
      environment: config.environment,
      event,
      ...fields,
    };
    const output = JSON.stringify(entry);
    if (level === "error") console.error(output);
    else console.log(output);
  }

  return {
    enabled: Boolean(config.dsn),
    requestMiddleware() {
      return (req, res, next) => {
        const startedAt = performance.now();
        req.requestId = randomUUID();
        res.setHeader("X-Request-ID", req.requestId);
        res.on("finish", () => {
          write("info", "http_request", {
            requestId: req.requestId,
            method: req.method,
            path: req.path,
            status: res.statusCode,
            durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
            userId: req.user?.id || null,
          });
        });
        next();
      };
    },
    info(event, fields) {
      write("info", event, fields);
    },
    error(event, error, fields = {}) {
      write("error", event, {
        ...fields,
        error: serializeError(error, config.environment !== "production"),
      });
    },
    captureException(error, context = {}) {
      if (!config.dsn) return;
      Sentry.withScope((scope) => {
        scope.setContext("request", context);
        Sentry.captureException(error);
      });
    },
    async flush(timeout = 2000) {
      if (config.dsn) await Sentry.flush(timeout);
    },
  };
}
