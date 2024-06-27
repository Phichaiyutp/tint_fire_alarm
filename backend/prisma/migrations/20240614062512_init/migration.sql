-- CreateTable
CREATE TABLE "AjaxUser" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_role" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "AjaxUser_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "AjaxMsHub" (
    "id" SERIAL NOT NULL,
    "hub_id" TEXT NOT NULL,
    "hub_binding_role" TEXT,
    "user_id" TEXT,

    CONSTRAINT "AjaxMsHub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AjaxHub" (
    "id" SERIAL NOT NULL,
    "hub_id" TEXT NOT NULL,
    "name" TEXT,
    "cellular_signal" TEXT,
    "connection" BOOLEAN,
    "battery_level" INTEGER,
    "battery_state" TEXT,
    "ethernet_ip" TEXT,
    "ethernet_subnet" TEXT,
    "ethernet_gateway" TEXT,
    "ethernet_dns" TEXT,
    "sim1_number" TEXT,
    "sim2_number" TEXT,
    "active_sim_card" INTEGER,
    "average_noise" INTEGER,
    "installation_date" TIMESTAMP(3),

    CONSTRAINT "AjaxHub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HubEventCode" (
    "id" SERIAL NOT NULL,
    "event_code" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "hub_id" TEXT NOT NULL,
    "hub_name" TEXT,
    "timestamp" BIGINT,
    "description" TEXT,

    CONSTRAINT "HubEventCode_pkey" PRIMARY KEY ("id")
);

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
    "notify" BOOLEAN NOT NULL DEFAULT false,
    "alert" BOOLEAN NOT NULL DEFAULT false,
    "alert_levels" INTEGER,

    CONSTRAINT "FloorPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" SERIAL NOT NULL,
    "room_id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "location" TEXT,
    "x_axis" INTEGER,
    "y_axis" INTEGER,
    "img_url" TEXT,
    "floor_plan_id" INTEGER,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "AjaxSmoke" (
    "id" SERIAL NOT NULL,
    "device_id" TEXT NOT NULL,
    "device_name" TEXT NOT NULL,
    "temp" DOUBLE PRECISION,
    "signal" TEXT,
    "battery_level" INTEGER,
    "temp_alarm" TEXT,
    "temp_alarm_enable" TEXT,
    "temp_diff_alarm_enable" TEXT,
    "temp_high_diff_alarm" TEXT,
    "co_alarm" TEXT,
    "co_alarm_enable" TEXT,
    "critical_co_alarm" TEXT,
    "critical_smoke_alarm" TEXT,
    "smoke_alarm" TEXT,
    "steam_alarm" TEXT,
    "installation_date" BIGINT,

    CONSTRAINT "AjaxSmoke_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmokeEventCode" (
    "id" SERIAL NOT NULL,
    "event_code" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "device_name" TEXT,
    "timestamp" BIGINT,
    "description" TEXT,

    CONSTRAINT "SmokeEventCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "roleId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AjaxUser_user_id_key" ON "AjaxUser"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserEventCode_event_id_key" ON "UserEventCode"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "AjaxMsHub_hub_id_key" ON "AjaxMsHub"("hub_id");

-- CreateIndex
CREATE UNIQUE INDEX "AjaxHub_hub_id_key" ON "AjaxHub"("hub_id");

-- CreateIndex
CREATE UNIQUE INDEX "HubEventCode_event_id_key" ON "HubEventCode"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "Zone_room_id_key" ON "Zone"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "AjaxMsSmoke_device_id_key" ON "AjaxMsSmoke"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "AjaxMsSmoke_room_id_key" ON "AjaxMsSmoke"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "AjaxSmoke_device_id_key" ON "AjaxSmoke"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "AjaxSmoke_device_name_key" ON "AjaxSmoke"("device_name");

-- CreateIndex
CREATE UNIQUE INDEX "SmokeEventCode_event_id_key" ON "SmokeEventCode"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- AddForeignKey
ALTER TABLE "UserEventCode" ADD CONSTRAINT "UserEventCode_hub_id_fkey" FOREIGN KEY ("hub_id") REFERENCES "AjaxMsHub"("hub_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEventCode" ADD CONSTRAINT "UserEventCode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "AjaxUser"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AjaxMsHub" ADD CONSTRAINT "AjaxMsHub_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "AjaxUser"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AjaxHub" ADD CONSTRAINT "AjaxHub_hub_id_fkey" FOREIGN KEY ("hub_id") REFERENCES "AjaxMsHub"("hub_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubEventCode" ADD CONSTRAINT "HubEventCode_hub_id_fkey" FOREIGN KEY ("hub_id") REFERENCES "AjaxHub"("hub_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_floor_plan_id_fkey" FOREIGN KEY ("floor_plan_id") REFERENCES "FloorPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AjaxMsSmoke" ADD CONSTRAINT "AjaxMsSmoke_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Zone"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AjaxMsSmoke" ADD CONSTRAINT "AjaxMsSmoke_hub_id_fkey" FOREIGN KEY ("hub_id") REFERENCES "AjaxHub"("hub_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AjaxSmoke" ADD CONSTRAINT "AjaxSmoke_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "AjaxMsSmoke"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmokeEventCode" ADD CONSTRAINT "SmokeEventCode_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "AjaxSmoke"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
