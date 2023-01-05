import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';
import { UpdateCredentialInput } from 'src/typescript/gql-generated-types';

export class UpdateCredentialDto extends UpdateCredentialInput {
  @IsEmail()
  email?: string;
}
