import { IsArray, IsNotEmpty } from 'class-validator';
import { DeleteUsersInput } from 'src/typescript/gql-generated-types';

export class DeleteUsersDto extends DeleteUsersInput {
  @IsNotEmpty()
  @IsArray()
  ids: string[];
}
