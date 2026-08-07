/*
  Warnings:

  - You are about to drop the column `category` on the `WardrobeItem` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `WardrobeItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BodyZone" AS ENUM ('HEAD', 'FACE', 'NECK', 'EARS', 'TORSO_INNER', 'TORSO_OUTER', 'WRIST', 'FINGER', 'WAIST', 'LEGS_INNER', 'LEGS_OUTER', 'FEET', 'HAND', 'FULL_BODY');

-- AlterTable
ALTER TABLE "WardrobeItem" DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "WardrobeCategory";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "zone" "BodyZone" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "WardrobeItem_categoryId_idx" ON "WardrobeItem"("categoryId");

-- AddForeignKey
ALTER TABLE "WardrobeItem" ADD CONSTRAINT "WardrobeItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
