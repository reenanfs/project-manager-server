import { IsNotEmpty, ValidateIf } from 'class-validator';
import { FileUpload } from 'src/common/interfaces/file-upload.interface';
import { UpdateUserInput } from 'src/typescript/gql-generated-types';

export class UpdateUserDto extends UpdateUserInput {
  @ValidateIf((object, value) => value !== undefined)
  @IsNotEmpty()
  name: string;

  @ValidateIf((object, value) => value !== undefined)
  @IsNotEmpty()
  isAdmin: boolean;

  @ValidateIf((object, value) => value !== undefined)
  photoFile?: FileUpload | null;
}
