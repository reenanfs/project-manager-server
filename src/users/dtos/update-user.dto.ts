import { IsEmail, ValidateIf } from 'class-validator';
import { UpdateUserInput } from 'src/typescript/gql-generated-types';

export class UpdateUserDto extends UpdateUserInput {
  @IsEmail()
  @ValidateIf((object) => object.email !== undefined)
  email: string;
}
