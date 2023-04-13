import { Injectable, Inject } from '@nestjs/common';
import { IFileUploaderService } from './interfaces/file-uploader.interface';
import { IStorageProvider } from './interfaces/storage-provider.interface';
import { FileUpload } from 'src/common/interfaces/file-upload.interface';

@Injectable()
export class FileUploaderService implements IFileUploaderService {
  constructor(private readonly storageProvider: IStorageProvider) {}

  async uploadFile(file: FileUpload): Promise<string> {
    return this.storageProvider.uploadFile(file);
  }

  async deleteFile(fileUrl: string): Promise<void> {
    return this.storageProvider.deleteFile(fileUrl);
  }
}
