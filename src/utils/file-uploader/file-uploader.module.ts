import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileUploaderService } from './file-uploader.service';
import { S3StorageService } from './services/s3-storage.service';
import { IStorageProvider } from './interfaces/storage-provider.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    FileUploaderService,
    S3StorageService,
    {
      provide: IStorageProvider,
      useClass: S3StorageService,
    },
  ],
  exports: [FileUploaderService, S3StorageService],
})
export class FileUploaderModule {}
