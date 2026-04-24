import { prisma } from "./src/lib/prisma";

interface DoctorRow {
  id: string;
}

async function main() {
  const cityLower = "jehanabad".toLowerCase();
  const rawIds = await prisma.$queryRaw<DoctorRow[]>`SELECT id FROM Doctor WHERE LOWER(city) LIKE '%' || ${cityLower} || '%'`;
  console.log("rawIds:", rawIds);

  const docs = await prisma.doctor.findMany({
    where: { id: { in: rawIds.map((r) => r.id) } },
    include: { user: true }
  });
  console.log("docs count:", docs.length);
  if (docs.length > 0) {
    console.log("doc 0 city:", docs[0].city);
  } else {
    // let's see ALL cities in the db
    const all = await prisma.doctor.findMany({ select: { city: true }});
    console.log("all cities:", all.map(d => d.city));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
