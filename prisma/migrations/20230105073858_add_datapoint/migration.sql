-- CreateTable
CREATE TABLE "DataPoint" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "avgPrice" TEXT,
    "maxPrice" TEXT,
    "minPrice" TEXT,
    "salesCount" TEXT,
    "salesVolume" TEXT,
    "tokensMinted" TEXT,
    "tokensBurned" TEXT,
    "totalMinted" TEXT,
    "totalBurned" TEXT,
    "tokenCount" TEXT,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "DataPoint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DataPoint" ADD CONSTRAINT "DataPoint_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
