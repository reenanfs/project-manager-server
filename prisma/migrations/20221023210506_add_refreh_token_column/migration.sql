/*
  Warnings:

  - Added the required column `refresh_token` to the `credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credentials" ADD COLUMN     "refresh_token" TEXT NOT NULL;
