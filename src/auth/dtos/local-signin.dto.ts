import { IsEmail } from 'class-validator';
import { LocalSigninInput } from 'src/typescript/gql-generated-types';

export class LocalSigninDto extends LocalSigninInput {
  @IsEmail()
  email: string;
}
