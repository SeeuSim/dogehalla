import { PrismaClient, RoleEnumType } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const hashedPwd = await argon2.hash(process.env.ADMIN_PASSWORD??"AdminPwd2");

  //Create default admin user.
  await prisma.user.create({
    data: {
      name: "Dev Admin",
      email: "cryptodogettm@gmail.com",
      password: hashedPwd,
      role: RoleEnumType.admin,
      verified: true
    }
  });
}

main().then(async () => {
  await prisma.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})