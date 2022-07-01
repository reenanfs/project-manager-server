import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { UpdateTaskInput } from 'src/typescript/gql-generated-types';
import { Nullable } from 'src/typescript/types';

export class UpdateTaskDto extends UpdateTaskInput {
  @IsNotEmpty()
  taskName?: string;

  @IsNotEmpty()
  userId?: string;

  @IsOptional()
  @IsDate()
  startDate?: Nullable<Date>;

  @IsOptional()
  @IsDate()
  dueDate?: Nullable<Date>;

  @IsOptional()
  @IsDate()
  completionDate?: Nullable<Date>;

  @IsOptional()
  @IsBoolean()
  completed?: Nullable<boolean>;
}
