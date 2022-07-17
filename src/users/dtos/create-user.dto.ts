import { IsEmail } from 'class-validator';
import { CreateUserInput } from 'src/typescript/gql-generated-types';

export class CreateUserDto extends CreateUserInput {
  @IsEmail()
  email: string;
}
