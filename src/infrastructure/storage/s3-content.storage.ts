import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type ContentStorage } from "#/application/ports/content";

export class S3ContentStorage implements ContentStorage {
  private readonly client: S3Client;

  constructor(
    private readonly config: {
      bucket: string;
      region: string;
      endpoint: string;
      accessKeyId: string;
      secretAccessKey: string;
    },
  ) {
    this.client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async upload(input: {
    key: string;
    body: Uint8Array;
    contentType: string;
    contentLength: number;
  }): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: input.key,
        Body: input.body,
        ContentType: input.contentType,
        ContentLength: input.contentLength,
      }),
    );
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      }),
    );
  }

  async getPresignedDownloadUrl(input: {
    key: string;
    expiresInSeconds: number;
  }): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: input.key,
    });
    return getSignedUrl(this.client, command, {
      expiresIn: input.expiresInSeconds,
    });
  }
}
