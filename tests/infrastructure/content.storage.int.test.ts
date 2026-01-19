import { describe, expect, test } from "bun:test";
import { S3ContentStorage } from "#/infrastructure/storage/s3-content.storage";

const runIntegration = process.env.RUN_INTEGRATION === "true";
const hasMinio =
  runIntegration &&
  Boolean(
    process.env.MINIO_ENDPOINT &&
      process.env.MINIO_BUCKET &&
      process.env.MINIO_ROOT_USER &&
      process.env.MINIO_ROOT_PASSWORD,
  );

const maybeTest = hasMinio ? test : test.skip;

describe("S3ContentStorage (integration)", () => {
  maybeTest("uploads, downloads, and deletes an object", async () => {
    const endpoint = process.env.MINIO_ENDPOINT ?? "localhost";
    const port = Number(process.env.MINIO_PORT ?? "9000");
    const useSsl = process.env.MINIO_USE_SSL === "true";
    const region = process.env.MINIO_REGION ?? "us-east-1";
    const bucket = process.env.MINIO_BUCKET ?? "content";

    const storage = new S3ContentStorage({
      bucket,
      region,
      endpoint: `${useSsl ? "https" : "http"}://${endpoint}:${port}`,
      accessKeyId: process.env.MINIO_ROOT_USER ?? "minioadmin",
      secretAccessKey: process.env.MINIO_ROOT_PASSWORD ?? "minioadmin",
    });

    const key = `content/integration/${crypto.randomUUID()}.txt`;
    const body = new TextEncoder().encode("hello");

    await storage.upload({
      key,
      body,
      contentType: "text/plain",
      contentLength: body.length,
    });

    const url = await storage.getPresignedDownloadUrl({
      key,
      expiresInSeconds: 60,
    });

    const response = await fetch(url);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("hello");

    await storage.delete(key);
  });
});
