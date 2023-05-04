import { IsEmail, IsString, Matches } from 'class-validator';
import { LocalSignupInput } from 'src/typescript/gql-generated-types';

export class LocalSignupInputDto extends LocalSignupInput {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  password: string;
}
