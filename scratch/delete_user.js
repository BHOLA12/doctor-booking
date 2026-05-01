const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  const email = "rr4175653@gmail.com";
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`User with email ${email} not found.`);
      return;
    }

    await prisma.user.delete({
      where: { email },
    });

    console.log(`User ${user.name} (${email}) has been deleted.`);
  } catch (error) {
    console.error("Error deleting user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
