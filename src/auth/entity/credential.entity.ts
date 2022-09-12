import { Exclude } from 'class-transformer';
import { Credential } from 'src/typescript/gql-generated-types';

export class CredentialEntity extends Credential {
  @Exclude()
  password: string;
}
