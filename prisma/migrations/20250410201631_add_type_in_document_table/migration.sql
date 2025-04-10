-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('DOCUMENT', 'KANBAN');

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "type" "DocumentType";
