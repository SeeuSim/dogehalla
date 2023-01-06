/*
  Warnings:

  - A unique constraint covering the columns `[collectionId,tableId]` on the table `RankTableEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RankTableEntry_collectionId_tableId_key" ON "RankTableEntry"("collectionId", "tableId");
