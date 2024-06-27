const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const hubControllers = require("../controllers/ajax/hub.controllers");
const masterHubControllers = require("../controllers/ajax/master_hub.controllers");
const masterSmokeControllers = require("../controllers/ajax/master_smoke.controllers");
const smokeControllers = require("../controllers/ajax/smoke.controllers");
const zoneControllers = require("../controllers/ajax/zone.controllers");

async function main() {
  // Create roles
  const roleGuest = await prisma.role.create({
    data: {
      name: "guest",
      description: "Temporary account",
    },
  });

  const roleUser = await prisma.role.create({
    data: {
      name: "user",
      description: "General user account",
    },
  });

  const roleAdmin = await prisma.role.create({
    data: {
      name: "admin",
      description: "System administrator account",
    },
  });

  // Create groups
  const groupA = await prisma.group.create({
    data: {
      name: "general",
      description: "General group",
    },
  });

  const groupB = await prisma.group.create({
    data: {
      name: "administrator",
      description: "System operator group",
    },
  });

  const groupC = await prisma.group.create({
    data: {
      name: "jatujak",
      description: "Headquarters@Jatujak group",
    },
  });

  const groupD = await prisma.group.create({
    data: {
      name: "rangsit",
      description: "Rangsit - Klong 5 group",
    },
  });

  const groupE = await prisma.group.create({
    data: {
      name: "nyk",
      description: "Nakornnayok group",
    },
  });

  // Create users
  await prisma.user.create({
    data: {
      name: "admin",
      roleId: roleAdmin.id,
      groupId: groupB.id,
      email: "admin@planetcloud.cloud",
      password: await bcrypt.hash("pca@1234", 10), 
      image: "",
    },
  });

  // Seed Users
  await prisma.ajaxUser.create({
    data: {
      user_id: "632D64FE",
      user_role: "USER",
      name: "phichaiyut",
      email: "phichaiyut@planetcloud.cloud",
      password: "Planetcomm@123",
    },
  });
  // Seed FloorPlan
  await prisma.floorPlan.create({
    data: {
      name: "Main Floor",
      floor: "1",
      width: 0,
      height: 0,
      description: "FloorPlan",
    },
  });
  // Seed Zone
  await zoneControllers.ZoneRegister();
  // Seed AjaxMsHub
  await masterHubControllers.MasterHubRegister();
  // Seed AjaxHub
  await hubControllers.HubRegister();
  // Seed AjaxMsSmoke
  await masterSmokeControllers.MasterSmokeRegister();
  // Seed AjaxSmoke
  await smokeControllers.SmokeRegister();

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
