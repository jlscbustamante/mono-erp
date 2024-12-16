import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config";

export class S3Service {
  private readonly client: S3Client;
  private readonly folder = "asistencia_personal";

  constructor() {
    this.client = new S3Client({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKey,
        secretAccessKey: config.aws.secretKey,
      },
    });
  }

  async uploadAssistanceFile(file: File, pathFile: string): Promise<string> {
    const buffer = await file.arrayBuffer();

    const allPath = `${this.folder}/${pathFile}`;

    const command = new PutObjectCommand({
      Bucket: config.aws.s3.bucket,
      Key: allPath,
      Body: Buffer.from(buffer),
    });
    await this.client.send(command);
    return allPath;
  }

  async getPresignedUrl(path: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: config.aws.s3.bucket,
      Key: path,
    });
    // 10min
    const durationInSeconds = 60 * 10;
    const url = await getSignedUrl(this.client, command, {
      expiresIn: durationInSeconds,
    });
    return url;
  }

  async getContent(path: string) {
    const command = new GetObjectCommand({
      Bucket: config.aws.s3.bucket,
      Key: path,
    });
    return this.client.send(command);
  }
}
