import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';
import { UpdateUserInput } from 'src/typescript/gql-generated-types';

export class UpdateUserDto extends UpdateUserInput {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  role: string;

  @IsEmail()
  @ValidateIf((object) => object.email !== undefined)
  email: string;
}
