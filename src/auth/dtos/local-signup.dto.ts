import { IsEmail, MinLength } from 'class-validator';
import { LocalSignupInput } from 'src/typescript/gql-generated-types';

export class LocalSignupDto extends LocalSignupInput {
  @IsEmail()
  email: string;
}
