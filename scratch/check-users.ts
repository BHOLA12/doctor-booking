import { prisma } from "../src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true
    }
  });
  console.log("USERS IN DB:", JSON.stringify(users, null, 2));
}

main()
  .catch(console.error);
