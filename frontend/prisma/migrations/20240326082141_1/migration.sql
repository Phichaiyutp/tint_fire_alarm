-- CreateTable
CREATE TABLE "AjaxUser" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "AjaxUser_pkey" PRIMARY KEY ("id")
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
    "sim1_active" BOOLEAN,
    "sim2_active" BOOLEAN,
    "average_noise" TEXT,
    "installation_date" TIMESTAMP(3),

    CONSTRAINT "AjaxHub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HubEventCode" (
    "id" INTEGER NOT NULL,
    "event_code" TEXT NOT NULL,
    "hub_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "HubEventCode_pkey" PRIMARY KEY ("id")
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
    "floor" TEXT,
    "img_url" TEXT,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MsAjaxSmoke" (
    "id" SERIAL NOT NULL,
    "device_id" TEXT NOT NULL,
    "device_type" TEXT,
    "device_name" TEXT,
    "room_id" TEXT NOT NULL,
    "group_id" TEXT,
    "color" TEXT,
    "online" BOOLEAN,
    "hub_id" TEXT,

    CONSTRAINT "MsAjaxSmoke_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AjaxSmoke" (
    "id" SERIAL NOT NULL,
    "device_id" TEXT NOT NULL,
    "zone_id" INTEGER,
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
    "installation_date" TIMESTAMP(3),

    CONSTRAINT "AjaxSmoke_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmokeEventCode" (
    "id" INTEGER NOT NULL,
    "event_code" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "SmokeEventCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AjaxUser_user_id_key" ON "AjaxUser"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AjaxMsHub_hub_id_key" ON "AjaxMsHub"("hub_id");

-- CreateIndex
CREATE UNIQUE INDEX "AjaxHub_hub_id_key" ON "AjaxHub"("hub_id");

-- CreateIndex
CREATE UNIQUE INDEX "HubEventCode_id_key" ON "HubEventCode"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Zone_room_id_key" ON "Zone"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "MsAjaxSmoke_device_id_key" ON "MsAjaxSmoke"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "MsAjaxSmoke_room_id_key" ON "MsAjaxSmoke"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "AjaxSmoke_device_id_key" ON "AjaxSmoke"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "SmokeEventCode_id_key" ON "SmokeEventCode"("id");

-- AddForeignKey
ALTER TABLE "AjaxMsHub" ADD CONSTRAINT "AjaxMsHub_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "AjaxUser"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AjaxHub" ADD CONSTRAINT "AjaxHub_hub_id_fkey" FOREIGN KEY ("hub_id") REFERENCES "AjaxMsHub"("hub_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HubEventCode" ADD CONSTRAINT "HubEventCode_hub_id_fkey" FOREIGN KEY ("hub_id") REFERENCES "AjaxHub"("hub_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MsAjaxSmoke" ADD CONSTRAINT "MsAjaxSmoke_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Zone"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MsAjaxSmoke" ADD CONSTRAINT "MsAjaxSmoke_hub_id_fkey" FOREIGN KEY ("hub_id") REFERENCES "AjaxHub"("hub_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AjaxSmoke" ADD CONSTRAINT "AjaxSmoke_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "MsAjaxSmoke"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmokeEventCode" ADD CONSTRAINT "SmokeEventCode_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "AjaxSmoke"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;
