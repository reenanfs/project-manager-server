import { Test, TestingModule } from '@nestjs/testing';
import { FileUploaderService } from './file-uploader.service';
import { IStorageProvider } from './interfaces/storage-provider.interface';
import { S3StorageService } from './services/s3-storage.service';

describe('FileUploaderService', () => {
  let service: FileUploaderService;

  beforeEach(async () => {
    const mockStorageProvider = {};
    const mockS3StorageService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploaderService,
        S3StorageService,
        {
          provide: IStorageProvider,
          useClass: S3StorageService,
        },
      ],
    })
      .overrideProvider(IStorageProvider)
      .useValue(mockStorageProvider)
      .overrideProvider(S3StorageService)
      .useValue(mockS3StorageService)
      .compile();

    service = module.get<FileUploaderService>(FileUploaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
