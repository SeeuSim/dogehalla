-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "floor" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "image" SET DEFAULT 'user_profilepic.png';
