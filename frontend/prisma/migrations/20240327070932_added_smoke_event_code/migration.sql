/*
  Warnings:

  - You are about to drop the column `objec_name` on the `SmokeEventCode` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SmokeEventCode" DROP CONSTRAINT "SmokeEventCode_objec_name_fkey";

-- AlterTable
ALTER TABLE "SmokeEventCode" DROP COLUMN "objec_name",
ADD COLUMN     "device_name" TEXT;

-- AddForeignKey
ALTER TABLE "SmokeEventCode" ADD CONSTRAINT "SmokeEventCode_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "AjaxSmoke"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;
