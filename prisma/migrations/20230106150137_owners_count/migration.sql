/*
  Warnings:

  - You are about to drop the column `tokenCount` on the `DataPoint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DataPoint" DROP COLUMN "tokenCount",
ADD COLUMN     "ownersCount" TEXT;
