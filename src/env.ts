import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string(),

    // Ensures required database environment variables are present
    MYSQL_ROOT_PASSWORD: z.string(),
    MYSQL_HOST: z.string(),
    MYSQL_PORT: z.coerce.number().default(3306),
    MYSQL_DATABASE: z.string(),
    MYSQL_USER: z.string(),
    MYSQL_PASSWORD: z.string(),

    // MinIO Configuration
    MINIO_ROOT_USER: z.string().default("minioadmin"),
    MINIO_ROOT_PASSWORD: z.string().default("minioadmin"),
    MINIO_ENDPOINT: z.string().default("localhost"),
    MINIO_PORT: z.coerce.number().default(9000),
    MINIO_CONSOLE_PORT: z.coerce.number().default(9001),
    MINIO_USE_SSL: z.coerce.boolean().default(false),
    MINIO_BUCKET: z.string().default("content"),

    // Auth Configuration
    HTSHADOW_PATH: z.string().default("/etc/htshadow"),
    JWT_SECRET: z.string(),
    JWT_ISSUER: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
