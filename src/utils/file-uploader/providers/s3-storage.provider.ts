import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { IStorageProvider } from '../interfaces/storage-provider.interface';
import { FileUpload } from 'src/common/interfaces/file-upload.interface';

@Injectable()
export class S3StorageProvider implements IStorageProvider {
  private readonly s3: S3;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    this.s3 = new S3({
      region: this.configService.get<string>('AWS_REGION'),
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async uploadFile(file: FileUpload): Promise<string> {
    const fileKey = uuidv4();
    const { createReadStream, filename, mimetype } = await file;

    await this.s3
      .upload({
        Bucket: this.bucketName,
        Key: `${filename}-${fileKey}`,
        Body: createReadStream(),
        ContentType: mimetype,
      })
      .promise();

    return `https://${this.bucketName}.s3.amazonaws.com/${fileKey}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const fileKey = fileUrl.split('/').pop();
    const fileParams = {
      Bucket: this.bucketName,
      Key: fileKey,
    };
    await this.s3.deleteObject(fileParams).promise();
  }
}
