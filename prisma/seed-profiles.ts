import 'dotenv/config';
import { PrismaClient as PrismaProfilesClient } from '@prisma/client-profiles';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL_PROFILES,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaProfilesClient({ adapter });

export async function seedProfiles() {
    console.log('🌱 Seeding Profiles Database...');

    await prisma.teacherProfile.deleteMany();
    await prisma.studentProfile.deleteMany();

    console.log('✅ Cleared existing profiles data');

    // Note: We need to use the same IDs as in the Academic database
    // For the seed, we'll use fixed IDs that match what we created in seed-academic
    // In a real scenario, you'd query the Academic DB to get these IDs

    // Teacher ID 1 corresponds to John Smith from Academic DB
    await prisma.teacherProfile.create({
        data: {
            id: 1,
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@university.edu',
            bio: 'Expert in Software Engineering with 10 years of experience.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        },
    });

    // Student ID 1 corresponds to Alex Thompson from Academic DB
    await prisma.studentProfile.create({
        data: {
            id: 1,
            firstName: 'Alex',
            lastName: 'Thompson',
            email: 'alex.thompson@student.edu',
            bio: 'Passionate about AI and web development.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        },
    });

    console.log('✅ Created 1 teacher profile and 1 student profile');
    console.log('✨ Profiles Seeding Finished');
}

if (require.main === module) {
    seedProfiles()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
