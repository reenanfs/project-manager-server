import { FileUpload } from 'src/common/interfaces/file-upload.interface';

export interface IFileUploaderService {
  uploadFile(file: FileUpload): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
}
