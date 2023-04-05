import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import { AuthInput } from 'src/typescript/gql-generated-types';

export class AuthInputDto extends AuthInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  password: string;
}
