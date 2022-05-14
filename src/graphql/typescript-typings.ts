
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateTaskInput {
    taskName: string;
    description?: Nullable<string>;
    userId: string;
    startDate: DateTime;
    dueDate: DateTime;
}

export interface UpdateTaskInput {
    id: string;
    taskName?: Nullable<string>;
    description?: Nullable<string>;
    userId?: Nullable<string>;
    startDate?: Nullable<DateTime>;
    dueDate?: Nullable<DateTime>;
    completionDate?: Nullable<DateTime>;
}

export interface TaskWhereUniqueInput {
    id: string;
}

export interface CreateUserInput {
    name: string;
    role: string;
    email: string;
}

export interface UpdateUserInput {
    id: string;
    name?: Nullable<string>;
    role?: Nullable<string>;
    email?: Nullable<string>;
}

export interface UserWhereUniqueInput {
    id: string;
}

export interface Task {
    id: string;
    taskName: string;
    description?: Nullable<string>;
    user?: Nullable<User>;
    startDate: DateTime;
    dueDate: DateTime;
    completionDate?: Nullable<DateTime>;
}

export interface IQuery {
    tasks(): Nullable<Nullable<Task>[]> | Promise<Nullable<Nullable<Task>[]>>;
    task(input: TaskWhereUniqueInput): Nullable<Task> | Promise<Nullable<Task>>;
    users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    user(input: UserWhereUniqueInput): Nullable<User> | Promise<Nullable<User>>;
}

export interface IMutation {
    createTask(input: CreateTaskInput): Nullable<Task> | Promise<Nullable<Task>>;
    updateTask(input: UpdateTaskInput): Nullable<Task> | Promise<Nullable<Task>>;
    deleteTask(input: TaskWhereUniqueInput): Nullable<Task> | Promise<Nullable<Task>>;
    createUser(input: CreateUserInput): Nullable<User> | Promise<Nullable<User>>;
    updateUser(input: UpdateUserInput): Nullable<User> | Promise<Nullable<User>>;
    deleteUser(input: UserWhereUniqueInput): Nullable<User> | Promise<Nullable<User>>;
}

export interface User {
    id: string;
    name: string;
    role: string;
    email: string;
}

export type DateTime = any;
type Nullable<T> = T | null;
