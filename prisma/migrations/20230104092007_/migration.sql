/*
  Warnings:

  - The `created_at` column on the `OAuthProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `canLink` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OAuthProfile" DROP COLUMN "created_at",
ADD COLUMN     "created_at" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "canLink";
