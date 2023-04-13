import { FileUpload } from 'src/common/interfaces/file-upload.interface';

export abstract class IStorageProvider {
  abstract uploadFile(file: FileUpload): Promise<string>;
  abstract deleteFile(fileUrl: string): Promise<void>;
}
