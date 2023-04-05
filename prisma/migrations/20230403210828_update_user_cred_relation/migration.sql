/*
  Warnings:

  - You are about to drop the column `credential_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_admin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `credentials` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `is_admin` to the `credentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `credentials` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_credential_id_fkey";

-- AlterTable
ALTER TABLE "credentials" ADD COLUMN     "is_admin" BOOLEAN NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "credential_id",
DROP COLUMN "email",
DROP COLUMN "is_admin",
DROP COLUMN "role";

-- CreateIndex
CREATE UNIQUE INDEX "credentials_user_id_key" ON "credentials"("user_id");

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
