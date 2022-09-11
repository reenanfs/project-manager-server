import { IsNotEmpty, ValidateIf } from 'class-validator';
import { UpdateTaskInput } from 'src/typescript/gql-generated-types';

export class UpdateTaskDto extends UpdateTaskInput {
  @ValidateIf((object, value) => value !== undefined)
  @IsNotEmpty()
  name: string;

  @ValidateIf((object, value) => value !== undefined)
  @IsNotEmpty()
  userId: string;

  @ValidateIf((object, value) => value !== undefined)
  @IsNotEmpty()
  projectId: string;
}
