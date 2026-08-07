/*
  Warnings:

  - You are about to drop the column `zone` on the `Category` table. All the data in the column will be lost.
  - Added the required column `zoneId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "zone",
ADD COLUMN     "zoneId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "BodyZone";

-- CreateTable
CREATE TABLE "BodyZone" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "allowMultiple" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BodyZone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BodyZone_code_key" ON "BodyZone"("code");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "BodyZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
