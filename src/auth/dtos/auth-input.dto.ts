import { IsEmail, IsString, Matches } from 'class-validator';
import { AuthInput } from 'src/typescript/gql-generated-types';

export class AuthInputDto extends AuthInput {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{12,}$/)
  password: string;
}
