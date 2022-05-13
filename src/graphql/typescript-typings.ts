
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface UserInput {
    name: string;
    role: string;
    email: string;
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
    task(id: string): Nullable<Task> | Promise<Nullable<Task>>;
    users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    user(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export interface User {
    id: string;
    name: string;
    role: string;
    email: string;
}

export interface IMutation {
    userCreate(input: UserInput): Nullable<User> | Promise<Nullable<User>>;
}

export type DateTime = any;
type Nullable<T> = T | null;
