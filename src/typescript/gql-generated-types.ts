
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

export class AuthInput {
    name?: Nullable<string>;
    email: string;
    password: string;
}

export class LocalSignoutInput {
    id: string;
}

export class DeleteMultipleItemsInput {
    ids: string[];
}

export class GetCredentialsOrderBy {
    updatedAt?: Nullable<SortOrder>;
}

export class GetCredentialsInput {
    orderBy?: Nullable<GetCredentialsOrderBy>;
}

export class CreateCredentialInput {
    email: string;
    password: string;
    refreshToken?: Nullable<string>;
    userId: string;
}

export class UpdateCredentialInput {
    id: string;
    email?: Nullable<string>;
    refreshToken?: Nullable<string>;
    userId?: Nullable<string>;
}

export class CredentialWhereUniqueInput {
    id?: Nullable<string>;
    email?: Nullable<string>;
    userId?: Nullable<string>;
}

export class GetPermissionsOrderBy {
    updatedAt?: Nullable<SortOrder>;
}

export class GetPermissionsInput {
    orderBy?: Nullable<GetProjectsOrderBy>;
}

export class CreatePermissionInput {
    name: string;
    description?: Nullable<string>;
}

export class UpdatePermissionInput {
    id: string;
    name?: Nullable<string>;
    description?: Nullable<string>;
}

export class PermissionWhereUniqueInput {
    id: string;
}

export class GetProjectsOrderBy {
    updatedAt?: Nullable<SortOrder>;
}

export class GetProjectsInput {
    orderBy?: Nullable<GetProjectsOrderBy>;
}

export class CreateProjectInput {
    name: string;
    description?: Nullable<string>;
    ownerId: string;
}

export class UpdateProjectInput {
    id: string;
    name?: Nullable<string>;
    description?: Nullable<string>;
    ownerId?: Nullable<string>;
}

export class ProjectWhereUniqueInput {
    id: string;
}

export class AddMembershipInput {
    userId: string;
    projectId: string;
    roleId: string;
}

export class GetRolesOrderBy {
    updatedAt?: Nullable<SortOrder>;
}

export class GetRolesInput {
    orderBy?: Nullable<GetProjectsOrderBy>;
}

export class CreateRoleInput {
    name: string;
    description?: Nullable<string>;
}

export class UpdateRoleInput {
    id: string;
    name?: Nullable<string>;
    description?: Nullable<string>;
}

export class RoleWhereUniqueInput {
    id: string;
}

export class AddPermissionsOnRoleInput {
    roleId: string;
    permissionIds: string[];
}

export class GetTasksOrderBy {
    dueDate?: Nullable<SortOrder>;
    updatedAt?: Nullable<SortOrder>;
}

export class GetTasksInput {
    orderBy?: Nullable<GetTasksOrderBy>;
}

export class CreateTaskInput {
    name: string;
    description?: Nullable<string>;
    startDate?: Nullable<DateTime>;
    dueDate?: Nullable<DateTime>;
    completionDate?: Nullable<DateTime>;
    completed: boolean;
    userId: string;
    projectId: string;
}

export class UpdateTaskInput {
    id: string;
    name?: Nullable<string>;
    description?: Nullable<string>;
    startDate?: Nullable<DateTime>;
    dueDate?: Nullable<DateTime>;
    completionDate?: Nullable<DateTime>;
    completed?: Nullable<boolean>;
    userId?: Nullable<string>;
    projectId?: Nullable<string>;
}

export class TaskWhereUniqueInput {
    id: string;
}

export class GetUsersOrderBy {
    updatedAt?: Nullable<SortOrder>;
}

export class GetUsersInput {
    orderBy?: Nullable<GetUsersOrderBy>;
}

export class CreateUserInput {
    name: string;
    photoFile?: Nullable<Upload>;
    isAdmin: boolean;
    currentProjectId?: Nullable<string>;
}

export class UpdateUserInput {
    id: string;
    name?: Nullable<string>;
    photoFile?: Nullable<Upload>;
    isAdmin?: Nullable<boolean>;
    currentProjectId?: Nullable<string>;
}

export class UserWhereUniqueInput {
    id: string;
}

export class AuthResponse {
    access_token: string;
    refresh_token: string;
    credential: Credential;
}

export abstract class IMutation {
    abstract localSignin(input: AuthInput): AuthResponse | Promise<AuthResponse>;

    abstract localSignup(input: AuthInput): AuthResponse | Promise<AuthResponse>;

    abstract localSignout(input: LocalSignoutInput): Credential | Promise<Credential>;

    abstract createCredential(input: CreateCredentialInput): Nullable<Credential> | Promise<Nullable<Credential>>;

    abstract updateCredential(input: UpdateCredentialInput): Nullable<Credential> | Promise<Nullable<Credential>>;

    abstract deleteCredential(input: PermissionWhereUniqueInput): Nullable<Permission> | Promise<Nullable<Permission>>;

    abstract deleteCredentials(input?: Nullable<DeleteMultipleItemsInput>): Nullable<BulkOperationResult> | Promise<Nullable<BulkOperationResult>>;

    abstract createPermission(input: CreatePermissionInput): Nullable<Permission> | Promise<Nullable<Permission>>;

    abstract updatePermission(input: UpdatePermissionInput): Nullable<Permission> | Promise<Nullable<Permission>>;

    abstract deletePermission(input: PermissionWhereUniqueInput): Nullable<Permission> | Promise<Nullable<Permission>>;

    abstract deletePermissions(input?: Nullable<DeleteMultipleItemsInput>): Nullable<BulkOperationResult> | Promise<Nullable<BulkOperationResult>>;

    abstract createProject(input: CreateProjectInput): Nullable<Project> | Promise<Nullable<Project>>;

    abstract updateProject(input: UpdateProjectInput): Nullable<Project> | Promise<Nullable<Project>>;

    abstract deleteProject(input: ProjectWhereUniqueInput): Nullable<Project> | Promise<Nullable<Project>>;

    abstract deleteProjects(input?: Nullable<DeleteMultipleItemsInput>): Nullable<BulkOperationResult> | Promise<Nullable<BulkOperationResult>>;

    abstract addMembership(input: AddMembershipInput): Nullable<Project> | Promise<Nullable<Project>>;

    abstract createRole(input: CreateRoleInput): Nullable<Role> | Promise<Nullable<Role>>;

    abstract updateRole(input: UpdateRoleInput): Nullable<Role> | Promise<Nullable<Role>>;

    abstract deleteRole(input: RoleWhereUniqueInput): Nullable<Role> | Promise<Nullable<Role>>;

    abstract deleteRoles(input?: Nullable<DeleteMultipleItemsInput>): Nullable<BulkOperationResult> | Promise<Nullable<BulkOperationResult>>;

    abstract addPermissions(input: AddPermissionsOnRoleInput): Nullable<Role> | Promise<Nullable<Role>>;

    abstract createTask(input: CreateTaskInput): Nullable<Task> | Promise<Nullable<Task>>;

    abstract updateTask(input: UpdateTaskInput): Nullable<Task> | Promise<Nullable<Task>>;

    abstract deleteTask(input: TaskWhereUniqueInput): Nullable<Task> | Promise<Nullable<Task>>;

    abstract deleteTasks(input?: Nullable<DeleteMultipleItemsInput>): Nullable<BulkOperationResult> | Promise<Nullable<BulkOperationResult>>;

    abstract createUser(input: CreateUserInput): Nullable<User> | Promise<Nullable<User>>;

    abstract updateUser(input: UpdateUserInput): Nullable<User> | Promise<Nullable<User>>;

    abstract deleteUser(input: UserWhereUniqueInput): Nullable<User> | Promise<Nullable<User>>;

    abstract deleteUsers(input?: Nullable<DeleteMultipleItemsInput>): Nullable<BulkOperationResult> | Promise<Nullable<BulkOperationResult>>;
}

export abstract class IQuery {
    abstract whoAmI(): AuthResponse | Promise<AuthResponse>;

    abstract refreshToken(): AuthResponse | Promise<AuthResponse>;

    abstract credentials(input?: Nullable<CredentialWhereUniqueInput>): Nullable<Nullable<Credential>[]> | Promise<Nullable<Nullable<Credential>[]>>;

    abstract credential(input: CredentialWhereUniqueInput): Nullable<Credential> | Promise<Nullable<Credential>>;

    abstract permissions(): Nullable<Nullable<Permission>[]> | Promise<Nullable<Nullable<Permission>[]>>;

    abstract permission(input: PermissionWhereUniqueInput): Nullable<Permission> | Promise<Nullable<Permission>>;

    abstract projects(input?: Nullable<GetProjectsInput>): Nullable<Nullable<Project>[]> | Promise<Nullable<Nullable<Project>[]>>;

    abstract project(input: ProjectWhereUniqueInput): Nullable<Project> | Promise<Nullable<Project>>;

    abstract roles(): Nullable<Nullable<Role>[]> | Promise<Nullable<Nullable<Role>[]>>;

    abstract role(input: RoleWhereUniqueInput): Nullable<Role> | Promise<Nullable<Role>>;

    abstract tasks(input?: Nullable<GetTasksInput>): Nullable<Nullable<Task>[]> | Promise<Nullable<Nullable<Task>[]>>;

    abstract task(input: TaskWhereUniqueInput): Nullable<Task> | Promise<Nullable<Task>>;

    abstract test(input: TaskWhereUniqueInput): Nullable<Task> | Promise<Nullable<Task>>;

    abstract users(input?: Nullable<GetUsersInput>): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;

    abstract user(input: UserWhereUniqueInput): Nullable<User> | Promise<Nullable<User>>;
}

export class BulkOperationResult {
    count: number;
}

export class Credential {
    id: string;
    email: string;
    user?: Nullable<User>;
    refreshToken?: Nullable<string>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class Permission {
    id: string;
    name: string;
    description?: Nullable<string>;
    roles?: Nullable<Nullable<Role>[]>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class ProjectMembership {
    user: User;
    project: Project;
    role: Role;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class Project {
    id: string;
    name: string;
    description?: Nullable<string>;
    owner?: Nullable<User>;
    usersCurrentProject?: Nullable<Nullable<User>[]>;
    projectMemberships?: Nullable<Nullable<ProjectMembership>[]>;
    tasks?: Nullable<Nullable<Task>[]>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class Role {
    id: string;
    name: string;
    description?: Nullable<string>;
    permissions?: Nullable<Nullable<Permission>[]>;
    projectMemberships?: Nullable<Nullable<ProjectMembership>[]>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class Task {
    id: string;
    name: string;
    description?: Nullable<string>;
    startDate?: Nullable<DateTime>;
    dueDate?: Nullable<DateTime>;
    completionDate?: Nullable<DateTime>;
    completed?: Nullable<boolean>;
    user?: Nullable<User>;
    project?: Nullable<Project>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class User {
    id: string;
    name: string;
    photoUrl?: Nullable<string>;
    isAdmin: boolean;
    tasks?: Nullable<Nullable<Task>[]>;
    currentProject?: Nullable<Project>;
    projectsOwned?: Nullable<Nullable<Project>[]>;
    projectMemberships?: Nullable<Nullable<ProjectMembership>[]>;
    credential?: Nullable<Credential>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class Test {
    id?: Nullable<string>;
    url?: Nullable<string>;
}

export type DateTime = Date;
export type Upload = any;
type Nullable<T> = T | null;
