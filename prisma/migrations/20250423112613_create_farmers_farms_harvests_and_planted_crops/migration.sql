-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CPF', 'CNPJ');

-- CreateTable
CREATE TABLE "farmers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "document_type" "DocumentType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farmers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "totalArea" DOUBLE PRECISION NOT NULL,
    "arableArea" DOUBLE PRECISION NOT NULL,
    "vegetationArea" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "farmer_id" TEXT NOT NULL,

    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "harvests" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "harvests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planted_crops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "farm_id" TEXT NOT NULL,
    "harvest_id" TEXT NOT NULL,

    CONSTRAINT "planted_crops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "farmers_document_key" ON "farmers"("document");

-- AddForeignKey
ALTER TABLE "farms" ADD CONSTRAINT "farms_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "farmers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planted_crops" ADD CONSTRAINT "planted_crops_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planted_crops" ADD CONSTRAINT "planted_crops_harvest_id_fkey" FOREIGN KEY ("harvest_id") REFERENCES "harvests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
