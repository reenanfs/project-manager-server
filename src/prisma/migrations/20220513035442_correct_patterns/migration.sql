-- This is an empty migration.
ALTER TABLE "User" RENAME TO users;
ALTER TABLE "Task" RENAME TO tasks;

ALTER TABLE "tasks" RENAME "taskName" TO task_name;
ALTER TABLE "tasks" RENAME "startDate" TO start_date;
ALTER TABLE "tasks" RENAME "dueDate" TO due_date;
ALTER TABLE "tasks" RENAME "completionDate" TO completion_date;