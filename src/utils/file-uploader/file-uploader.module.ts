import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileUploaderService } from './file-uploader.service';
import { S3StorageProvider } from './providers/s3-storage.provider';
import { IStorageProvider } from './interfaces/storage-provider.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    FileUploaderService,
    {
      provide: IStorageProvider,
      useClass: S3StorageProvider,
    },
  ],
  exports: [FileUploaderService],
})
export class FileUploaderModule {}
