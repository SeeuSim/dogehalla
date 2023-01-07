/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Collection_address_key" ON "Collection"("address");
