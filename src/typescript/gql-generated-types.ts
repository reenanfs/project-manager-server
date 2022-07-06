
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum SortOrder {
    asc = "asc",
    desc = "desc"
}

export class GetTasksOrderBy {
    dueDate?: Nullable<SortOrder>;
    updatedAt?: Nullable<SortOrder>;
}

export class GetTasksInput {
    orderBy?: Nullable<GetTasksOrderBy>;
}

export class CreateTaskInput {
    taskName: string;
    description?: Nullable<string>;
    userId: string;
    startDate?: Nullable<DateTime>;
    dueDate?: Nullable<DateTime>;
    completed: boolean;
}

export class UpdateTaskInput {
    id: string;
    taskName?: Nullable<string>;
    description?: Nullable<string>;
    userId?: Nullable<string>;
    startDate?: Nullable<DateTime>;
    dueDate?: Nullable<DateTime>;
    completionDate?: Nullable<DateTime>;
    completed?: Nullable<boolean>;
}

export class DeleteTasksInput {
    ids: string[];
}

export class TaskWhereUniqueInput {
    id: string;
}

export class GetUsersOrderBy {
    updatedAt?: Nullable<SortOrder>;
}

export class CreateUserInput {
    name: string;
    role: string;
    email: string;
}

export class GetUsersInput {
    orderBy?: Nullable<GetTasksOrderBy>;
}

export class UpdateUserInput {
    id: string;
    name?: Nullable<string>;
    role?: Nullable<string>;
    email?: Nullable<string>;
}

export class DeleteUsersInput {
    ids: string[];
}

export class UserWhereUniqueInput {
    id: string;
}

export class Task {
    id: string;
    taskName: string;
    description?: Nullable<string>;
    user?: Nullable<User>;
    startDate?: Nullable<DateTime>;
    dueDate?: Nullable<DateTime>;
    completionDate?: Nullable<DateTime>;
    completed?: Nullable<boolean>;
}

export class BulkOperationResult {
    count: number;
}

export abstract class IQuery {
    abstract tasks(input?: Nullable<GetTasksInput>): Nullable<Nullable<Task>[]> | Promise<Nullable<Nullable<Task>[]>>;

    abstract task(input: TaskWhereUniqueInput): Nullable<Task> | Promise<Nullable<Task>>;

    abstract users(input?: Nullable<GetUsersInput>): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;

    abstract user(input: UserWhereUniqueInput): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract createTask(input: CreateTaskInput): Nullable<Task> | Promise<Nullable<Task>>;

    abstract updateTask(input: UpdateTaskInput): Nullable<Task> | Promise<Nullable<Task>>;

    abstract deleteTask(input: TaskWhereUniqueInput): Nullable<Task> | Promise<Nullable<Task>>;

    abstract deleteTasks(input?: Nullable<DeleteTasksInput>): Nullable<BulkOperationResult> | Promise<Nullable<BulkOperationResult>>;

    abstract createUser(input: CreateUserInput): Nullable<User> | Promise<Nullable<User>>;

    abstract updateUser(input: UpdateUserInput): Nullable<User> | Promise<Nullable<User>>;

    abstract deleteUser(input: UserWhereUniqueInput): Nullable<User> | Promise<Nullable<User>>;

    abstract deleteUsers(input?: Nullable<DeleteUsersInput>): Nullable<BulkOperationResult> | Promise<Nullable<BulkOperationResult>>;
}

export class User {
    id: string;
    name: string;
    role: string;
    email: string;
    tasks?: Nullable<Nullable<Task>[]>;
}

export type DateTime = any;
type Nullable<T> = T | null;
