/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `users` table. All the data in the column will be lost.
  - Added the required column `is_admin` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isAdmin",
DROP COLUMN "photoUrl",
ADD COLUMN     "is_admin" BOOLEAN NOT NULL,
ADD COLUMN     "photo_url" TEXT;
