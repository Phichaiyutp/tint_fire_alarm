/*
  Warnings:

  - You are about to drop the column `floor` on the `Zone` table. All the data in the column will be lost.
  - You are about to drop the `MsAjaxSmoke` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AjaxSmoke" DROP CONSTRAINT "AjaxSmoke_device_id_fkey";

-- DropForeignKey
ALTER TABLE "MsAjaxSmoke" DROP CONSTRAINT "MsAjaxSmoke_hub_id_fkey";

-- DropForeignKey
ALTER TABLE "MsAjaxSmoke" DROP CONSTRAINT "MsAjaxSmoke_room_id_fkey";

-- AlterTable
ALTER TABLE "Zone" DROP COLUMN "floor",
ADD COLUMN     "floor_plan_id" INTEGER;

-- DropTable
DROP TABLE "MsAjaxSmoke";

-- CreateTable
CREATE TABLE "FloorPlan" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "floor" TEXT,
    "img_url" TEXT,
    "img_b64" TEXT,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "description" TEXT,

    CONSTRAINT "FloorPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AjaxMsSmoke" (
    "id" SERIAL NOT NULL,
    "device_id" TEXT NOT NULL,
    "device_type" TEXT,
    "device_name" TEXT,
    "room_id" TEXT NOT NULL,
    "group_id" TEXT,
    "color" TEXT,
    "online" BOOLEAN,
    "hub_id" TEXT,

    CONSTRAINT "AjaxMsSmoke_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'member',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AjaxMsSmoke_device_id_key" ON "AjaxMsSmoke"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "AjaxMsSmoke_room_id_key" ON "AjaxMsSmoke"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_floor_plan_id_fkey" FOREIGN KEY ("floor_plan_id") REFERENCES "FloorPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AjaxMsSmoke" ADD CONSTRAINT "AjaxMsSmoke_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Zone"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AjaxMsSmoke" ADD CONSTRAINT "AjaxMsSmoke_hub_id_fkey" FOREIGN KEY ("hub_id") REFERENCES "AjaxHub"("hub_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AjaxSmoke" ADD CONSTRAINT "AjaxSmoke_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "AjaxMsSmoke"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;
