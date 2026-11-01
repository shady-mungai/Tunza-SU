import { OAuth2Client } from "google-auth-library";

export function createGoogleVerifier(config) {
  const client = new OAuth2Client();

  return async function verifyGoogleIdToken(idToken) {
    if (!config.clientIds.length) {
      throw Object.assign(new Error("Google sign-in is not configured"), {
        status: 503,
      });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: config.clientIds,
    });
    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email || !payload.email_verified) {
      throw Object.assign(new Error("Google account email is not verified"), {
        status: 401,
      });
    }

    if (config.hostedDomain && payload.hd !== config.hostedDomain) {
      throw Object.assign(new Error("Use an approved university Google account"), {
        status: 403,
      });
    }

    return {
      subject: payload.sub,
      email: payload.email.toLowerCase(),
      name: payload.name || payload.email.split("@")[0],
    };
  };
}
