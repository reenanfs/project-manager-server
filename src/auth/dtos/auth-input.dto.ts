import { IsEmail, IsString, Matches } from 'class-validator';
import { AuthInput } from 'src/typescript/gql-generated-types';

export class AuthInputDto extends AuthInput {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
