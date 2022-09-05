import { MinLength } from 'class-validator';
import { CredentialInput } from 'src/typescript/gql-generated-types';

export class CredentialDto extends CredentialInput {
  @MinLength(8)
  email: string;
}
