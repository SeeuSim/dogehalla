-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "data" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;
