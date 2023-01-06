import { populateDb } from "server/common/mnemonic/models";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await populateDb();
}

main().then(async () => {
  await prisma.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})