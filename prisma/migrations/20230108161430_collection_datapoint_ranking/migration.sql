/*
  Warnings:

  - The `created_at` column on the `OAuthProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `tokens` on the `Collection` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `owners` on the `Collection` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `salesVolume` on the `Collection` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CollectionsRank" AS ENUM ('avg_price', 'max_price', 'sales_count', 'sales_volume');

-- CreateEnum
CREATE TYPE "RankPeriod" AS ENUM ('1_DAY', '7_DAYS', '30_DAYS', '365_DAYS');

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "floor" DECIMAL(65,30),
DROP COLUMN "tokens",
ADD COLUMN     "tokens" INTEGER NOT NULL,
DROP COLUMN "owners",
ADD COLUMN     "owners" INTEGER NOT NULL,
DROP COLUMN "salesVolume",
ADD COLUMN     "salesVolume" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "OAuthProfile" DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "image" SET DEFAULT 'user_profilepic.png';

-- CreateTable
CREATE TABLE "RankTable" (
    "id" TEXT NOT NULL,
    "type" "CollectionsRank" NOT NULL,
    "timePeriod" "RankPeriod" NOT NULL,

    CONSTRAINT "RankTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankTableEntry" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "RankTableEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataPoint" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "avgPrice" DECIMAL(65,30),
    "maxPrice" DECIMAL(65,30),
    "minPrice" DECIMAL(65,30),
    "salesCount" BIGINT,
    "salesVolume" DECIMAL(65,30),
    "tokensMinted" DECIMAL(65,30),
    "tokensBurned" DECIMAL(65,30),
    "totalMinted" DECIMAL(65,30),
    "totalBurned" DECIMAL(65,30),
    "ownersCount" BIGINT,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "DataPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RankTable_type_timePeriod_key" ON "RankTable"("type", "timePeriod");

-- CreateIndex
CREATE UNIQUE INDEX "RankTableEntry_collectionId_tableId_key" ON "RankTableEntry"("collectionId", "tableId");

-- CreateIndex
CREATE UNIQUE INDEX "DataPoint_collectionId_timestamp_key" ON "DataPoint"("collectionId", "timestamp");

-- AddForeignKey
ALTER TABLE "RankTableEntry" ADD CONSTRAINT "RankTableEntry_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "RankTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankTableEntry" ADD CONSTRAINT "RankTableEntry_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPoint" ADD CONSTRAINT "DataPoint_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
