import 'dotenv/config';
import { prisma } from './src/lib/prisma';

const femaleImages = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1594824436998-d40b243ea4f2?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?auto=format&fit=crop&q=80&w=300&h=300"
];

const maleImages = [
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=300&h=300"
];

function isFemaleName(name: string) {
  const n = name.toLowerCase();
  return n.match(/(a|i|ee)$/i) || n.includes('kumari') || n.includes('devi') || (n.includes('singh') && n.includes('priya'));
}

async function main() {
  const doctors = await prisma.user.findMany({
    where: { role: 'DOCTOR' },
  });

  console.log(`Found ${doctors.length} doctors. Updating avatars...`);

  let updatedCount = 0;
  for (const doc of doctors) {
    let name = doc.name.replace(/^dr\\.?\\s*/i, '').trim();
    const isFemale = isFemaleName(name.split(' ')[0]);
    
    const list = isFemale ? femaleImages : maleImages;
    const imgIndex = name.length % list.length;
    const avatarUrl = list[imgIndex];

    await prisma.user.update({
      where: { id: doc.id },
      data: { avatar: avatarUrl }
    });
    console.log(`Updated ${doc.name} (${isFemale ? 'F' : 'M'}) -> ${avatarUrl.substring(0, 50)}...`);
    updatedCount++;
  }

  console.log(`Successfully updated ${updatedCount} doctor profiles with real photos.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    // await prisma.$disconnect();
  });
