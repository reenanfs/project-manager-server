import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateUserInput } from 'src/typescript/gql-generated-types';

export class CreateUserDto extends CreateUserInput {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  role: string;

  @IsEmail()
  email: string;
}
