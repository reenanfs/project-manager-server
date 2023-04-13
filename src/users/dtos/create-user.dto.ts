import { ValidateIf } from 'class-validator';
import { FileUpload } from 'src/common/interfaces/file-upload.interface';
import { CreateUserInput } from 'src/typescript/gql-generated-types';

export class CreateUserDto extends CreateUserInput {
  @ValidateIf((object, value) => value !== undefined)
  photoFile?: FileUpload;
}
