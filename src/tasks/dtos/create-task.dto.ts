import { IsDate, IsNotEmpty } from 'class-validator';
import { CreateTaskInput } from 'src/typescript/gql-generated-types';

export class CreateTaskDto extends CreateTaskInput {
  @IsNotEmpty()
  taskName: string;

  @IsNotEmpty()
  userId: string;

  @IsDate()
  startDate?: Date;

  @IsDate()
  dueDate?: Date;
}
