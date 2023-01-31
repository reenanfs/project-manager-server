/*
  Warnings:

  - You are about to drop the column `user_id` on the `credentials` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "credentials" DROP CONSTRAINT "credentials_user_id_fkey";

-- DropForeignKey
ALTER TABLE "project_memberships" DROP CONSTRAINT "project_memberships_role_id_fkey";

-- DropIndex
DROP INDEX "credentials_user_id_key";

-- AlterTable
ALTER TABLE "credentials" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "credential_id" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "role" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_credential_id_fkey" FOREIGN KEY ("credential_id") REFERENCES "credentials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_memberships" ADD CONSTRAINT "project_memberships_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
