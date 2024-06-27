/*
  Warnings:

  - You are about to drop the column `type` on the `AjaxUser` table. All the data in the column will be lost.
  - You are about to drop the column `objec_name` on the `HubEventCode` table. All the data in the column will be lost.
  - You are about to drop the column `room_name` on the `HubEventCode` table. All the data in the column will be lost.
  - The `timestamp` column on the `HubEventCode` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `hub_name` on the `SmokeEventCode` table. All the data in the column will be lost.
  - You are about to drop the column `room_name` on the `SmokeEventCode` table. All the data in the column will be lost.
  - The `timestamp` column on the `SmokeEventCode` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[event_id]` on the table `HubEventCode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[event_id]` on the table `SmokeEventCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_id` to the `HubEventCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `SmokeEventCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AjaxUser" DROP COLUMN "type",
ADD COLUMN     "user_role" TEXT;

-- AlterTable
ALTER TABLE "HubEventCode" DROP COLUMN "objec_name",
DROP COLUMN "room_name",
ADD COLUMN     "event_id" TEXT NOT NULL,
DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" BIGINT,
ALTER COLUMN "hub_name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SmokeEventCode" DROP COLUMN "hub_name",
DROP COLUMN "room_name",
ADD COLUMN     "event_id" TEXT NOT NULL,
DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" BIGINT;

-- CreateTable
CREATE TABLE "UserEventCode" (
    "id" SERIAL NOT NULL,
    "event_code" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "hub_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT,
    "timestamp" BIGINT,
    "description" TEXT,
    "additionalData" JSONB,

    CONSTRAINT "UserEventCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserEventCode_event_id_key" ON "UserEventCode"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "HubEventCode_event_id_key" ON "HubEventCode"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "SmokeEventCode_event_id_key" ON "SmokeEventCode"("event_id");

-- AddForeignKey
ALTER TABLE "UserEventCode" ADD CONSTRAINT "UserEventCode_hub_id_fkey" FOREIGN KEY ("hub_id") REFERENCES "AjaxMsHub"("hub_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEventCode" ADD CONSTRAINT "UserEventCode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "AjaxUser"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
