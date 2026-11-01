import path from "node:path";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function objectKey(prefix, extension) {
  return [prefix, `${randomUUID()}${extension}`].filter(Boolean).join("/");
}

function publicObjectUrl(baseUrl, key) {
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  return `${baseUrl.replace(/\/$/, "")}/${encodedKey}`;
}

export function createStorage(config) {
  if (config.driver === "local") {
    return {
      driver: "local",
      localDirectory: config.localDirectory,

      async save({ buffer, extension }) {
        const key = objectKey("", extension);
        await mkdir(config.localDirectory, { recursive: true });
        await writeFile(path.join(config.localDirectory, key), buffer, { flag: "wx" });
        return { key, url: `/uploads/${encodeURIComponent(key)}` };
      },

      async remove(key) {
        if (!key || path.basename(key) !== key) return;
        await unlink(path.join(config.localDirectory, key)).catch((error) => {
          if (error.code !== "ENOENT") throw error;
        });
      },

      async urlFor(key, fallback = null) {
        return key ? `/uploads/${encodeURIComponent(key)}` : fallback;
      },
    };
  }

  const clientOptions = {
    region: config.s3.region,
    ...(config.s3.endpoint ? { endpoint: config.s3.endpoint } : {}),
    ...(config.s3.forcePathStyle ? { forcePathStyle: true } : {}),
    ...(config.s3.accessKeyId && config.s3.secretAccessKey
      ? {
          credentials: {
            accessKeyId: config.s3.accessKeyId,
            secretAccessKey: config.s3.secretAccessKey,
          },
        }
      : {}),
  };
  const client = new S3Client(clientOptions);

  return {
    driver: "s3",
    localDirectory: null,

    async save({ buffer, mime, extension }) {
      const key = objectKey(config.s3.prefix, extension);
      await client.send(
        new PutObjectCommand({
          Bucket: config.s3.bucket,
          Key: key,
          Body: buffer,
          ContentType: mime,
          CacheControl: "private, max-age=31536000, immutable",
        })
      );
      return { key, url: await this.urlFor(key) };
    },

    async remove(key) {
      if (!key) return;
      await client.send(
        new DeleteObjectCommand({ Bucket: config.s3.bucket, Key: key })
      );
    },

    async urlFor(key, fallback = null) {
      if (!key) return fallback;
      if (config.s3.publicBaseUrl) {
        return publicObjectUrl(config.s3.publicBaseUrl, key);
      }
      return getSignedUrl(
        client,
        new GetObjectCommand({ Bucket: config.s3.bucket, Key: key }),
        { expiresIn: config.s3.signedUrlTtlSeconds }
      );
    },
  };
}
