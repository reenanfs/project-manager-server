/*
  Warnings:

  - You are about to drop the column `is_admin` on the `credentials` table. All the data in the column will be lost.
  - Added the required column `is_admin` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credentials" DROP COLUMN "is_admin";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false;
