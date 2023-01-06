/*
  Warnings:

  - A unique constraint covering the columns `[collectionId,timestamp]` on the table `DataPoint` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DataPoint_collectionId_timestamp_key" ON "DataPoint"("collectionId", "timestamp");
