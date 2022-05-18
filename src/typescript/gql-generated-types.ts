
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class CreateTaskInput {
    taskName: string;
    description?: Nullable<string>;
    userId: string;
    startDate: DateTime;
    dueDate: DateTime;
}

export class UpdateTaskInput {
    id: string;
    taskName?: Nullable<string>;
    description?: Nullable<string>;
    userId?: Nullable<string>;
    startDate?: Nullable<DateTime>;
    dueDate?: Nullable<DateTime>;
    completionDate?: Nullable<DateTime>;
}

export class TaskWhereUniqueInput {
    id: string;
}

export class CreateUserInput {
    name: string;
    role: string;
    email: string;
}

export class UpdateUserInput {
    id: string;
    name?: Nullable<string>;
    role?: Nullable<string>;
    email?: Nullable<string>;
}

export class UserWhereUniqueInput {
    id: string;
}

export class Task {
    id: string;
    taskName: string;
    description?: Nullable<string>;
    user?: Nullable<User>;
    startDate: DateTime;
    dueDate: DateTime;
    completionDate?: Nullable<DateTime>;
}

export abstract class IQuery {
    abstract tasks(): Nullable<Nullable<Task>[]> | Promise<Nullable<Nullable<Task>[]>>;

    abstract task(input: TaskWhereUniqueInput): Nullable<Task> | Promise<Nullable<Task>>;

    abstract users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;

    abstract user(input: UserWhereUniqueInput): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract createTask(input: CreateTaskInput): Nullable<Task> | Promise<Nullable<Task>>;

    abstract updateTask(input: UpdateTaskInput): Nullable<Task> | Promise<Nullable<Task>>;

    abstract deleteTask(input: TaskWhereUniqueInput): Nullable<Task> | Promise<Nullable<Task>>;

    abstract createUser(input: CreateUserInput): Nullable<User> | Promise<Nullable<User>>;

    abstract updateUser(input: UpdateUserInput): Nullable<User> | Promise<Nullable<User>>;

    abstract deleteUser(input: UserWhereUniqueInput): Nullable<User> | Promise<Nullable<User>>;
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
