import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { IStorageProvider } from '../interfaces/storage-provider.interface';
import { FileUpload } from 'src/common/interfaces/file-upload.interface';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ReadStream } from 'fs';

@Injectable()
export class S3StorageService implements IStorageProvider {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(file: FileUpload): Promise<string> {
    const key = uuidv4();
    const { createReadStream, filename, mimetype } = await file;

    const imageBuffer = await this.streamToBuffer(createReadStream());

    const folderName = this.configService.get<string>(
      'AWS_S3_USER_PICTURE_FOLDER_NAME',
    );

    const fileKey = `${folderName}/${key}:${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: imageBuffer,
      ContentType: mimetype,
    });

    await this.s3Client.send(command);

    return fileKey;
  }

  async deleteFile(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    await this.s3Client.send(command);
  }

  async generateSignedUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 1 * 60 * 60, //one hour
    });

    return signedUrl;
  }

  private async streamToBuffer(stream: ReadStream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const _buf: any[] = [];

      stream.on('data', (chunk) => _buf.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(_buf)));
      stream.on('error', (err) => reject(err));
    });
  }
}
