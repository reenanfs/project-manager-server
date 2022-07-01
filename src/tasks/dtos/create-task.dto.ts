import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateTaskInput } from 'src/typescript/gql-generated-types';

export class CreateTaskDto extends CreateTaskInput {
  @IsNotEmpty()
  taskName: string;

  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  dueDate?: Date;
}
