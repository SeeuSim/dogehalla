-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "tokens" TEXT NOT NULL,
    "owners" TEXT NOT NULL,
    "salesVolume" TEXT NOT NULL,
    "description" TEXT,
    "bannerImg" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "extURL" TEXT,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collection_address_key" ON "Collection"("address");
