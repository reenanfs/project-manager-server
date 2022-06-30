import { IsArray, IsNotEmpty } from 'class-validator';
import { DeleteTasksInput } from 'src/typescript/gql-generated-types';

export class DeleteTasksDto extends DeleteTasksInput {
  @IsNotEmpty()
  @IsArray()
  ids: string[];
}
