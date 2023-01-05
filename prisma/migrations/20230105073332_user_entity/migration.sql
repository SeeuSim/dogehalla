-- CreateEnum
CREATE TYPE "CollectionsRank" AS ENUM ('avg_price', 'max_price', 'sales_count', 'sales_volume');

-- CreateEnum
CREATE TYPE "RankPeriod" AS ENUM ('1_DAY', '7_DAYS', '30_DAYS', '365_DAYS');

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

-- CreateIndex
CREATE UNIQUE INDEX "RankTable_type_timePeriod_key" ON "RankTable"("type", "timePeriod");

-- AddForeignKey
ALTER TABLE "RankTableEntry" ADD CONSTRAINT "RankTableEntry_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "RankTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankTableEntry" ADD CONSTRAINT "RankTableEntry_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
