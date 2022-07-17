import { IsEmail, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { UpdateUserInput } from 'src/typescript/gql-generated-types';

export class UpdateUserDto extends UpdateUserInput {
  @ValidateIf((object, value) => value !== undefined)
  @IsNotEmpty()
  name: string;

  @ValidateIf((object, value) => value !== undefined)
  @IsNotEmpty()
  role: string;

  @ValidateIf((object, value) => value !== undefined)
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
