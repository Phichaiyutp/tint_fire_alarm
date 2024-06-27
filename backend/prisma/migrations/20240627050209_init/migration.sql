/*
  Warnings:

  - You are about to drop the column `img_b64` on the `FloorPlan` table. All the data in the column will be lost.
  - You are about to drop the column `img_url` on the `FloorPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FloorPlan" DROP COLUMN "img_b64",
DROP COLUMN "img_url",
ADD COLUMN     "img" TEXT;
