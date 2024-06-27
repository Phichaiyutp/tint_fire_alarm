/*
  Warnings:

  - You are about to drop the column `sim1_active` on the `AjaxHub` table. All the data in the column will be lost.
  - You are about to drop the column `sim2_active` on the `AjaxHub` table. All the data in the column will be lost.
  - The `average_noise` column on the `AjaxHub` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `zone_id` on the `AjaxSmoke` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[device_name]` on the table `AjaxSmoke` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `device_name` to the `AjaxSmoke` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hub_name` to the `HubEventCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objec_name` to the `HubEventCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_name` to the `HubEventCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objec_name` to the `SmokeEventCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SmokeEventCode" DROP CONSTRAINT "SmokeEventCode_device_id_fkey";

-- DropIndex
DROP INDEX "HubEventCode_id_key";

-- DropIndex
DROP INDEX "SmokeEventCode_id_key";

-- AlterTable
ALTER TABLE "AjaxHub" DROP COLUMN "sim1_active",
DROP COLUMN "sim2_active",
ADD COLUMN     "active_sim_card" INTEGER,
DROP COLUMN "average_noise",
ADD COLUMN     "average_noise" INTEGER;

-- AlterTable
ALTER TABLE "AjaxSmoke" DROP COLUMN "zone_id",
ADD COLUMN     "device_name" TEXT NOT NULL;

-- AlterTable
CREATE SEQUENCE hubeventcode_id_seq;
ALTER TABLE "HubEventCode" ADD COLUMN     "hub_name" TEXT NOT NULL,
ADD COLUMN     "objec_name" TEXT NOT NULL,
ADD COLUMN     "room_name" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('hubeventcode_id_seq');
ALTER SEQUENCE hubeventcode_id_seq OWNED BY "HubEventCode"."id";

-- AlterTable
CREATE SEQUENCE smokeeventcode_id_seq;
ALTER TABLE "SmokeEventCode" ADD COLUMN     "hub_name" TEXT,
ADD COLUMN     "objec_name" TEXT NOT NULL,
ADD COLUMN     "room_name" TEXT,
ALTER COLUMN "id" SET DEFAULT nextval('smokeeventcode_id_seq');
ALTER SEQUENCE smokeeventcode_id_seq OWNED BY "SmokeEventCode"."id";

-- CreateIndex
CREATE UNIQUE INDEX "AjaxSmoke_device_name_key" ON "AjaxSmoke"("device_name");

-- AddForeignKey
ALTER TABLE "SmokeEventCode" ADD CONSTRAINT "SmokeEventCode_objec_name_fkey" FOREIGN KEY ("objec_name") REFERENCES "AjaxSmoke"("device_name") ON DELETE RESTRICT ON UPDATE CASCADE;
