-- AlterTable
ALTER TABLE "users" ADD COLUMN     "current_project_id" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_current_project_id_fkey" FOREIGN KEY ("current_project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
