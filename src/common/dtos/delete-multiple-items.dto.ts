import { IsArray, IsNotEmpty } from 'class-validator';
import { DeleteMultipleItemsInput } from 'src/typescript/gql-generated-types';

export class DeleteMultipleItemsDto extends DeleteMultipleItemsInput {
  @IsNotEmpty()
  @IsArray()
  ids: string[];
}
