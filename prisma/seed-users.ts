import 'dotenv/config';
import { PrismaClient as PrismaUsersClient } from '@prisma/client-users';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL_USERS,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaUsersClient({ adapter });

export async function seedUsers() {
    console.log('🌱 Seeding Users Database...');

    await prisma.teacherAuth.deleteMany();
    await prisma.studentAuth.deleteMany();

    console.log('✅ Cleared existing auth data');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const teacherAuth = await prisma.teacherAuth.create({
        data: {
            email: 'john.smith@university.edu',
            password: hashedPassword,
            role: 'teacher',
        },
    });

    const studentAuth = await prisma.studentAuth.create({
        data: {
            email: 'alex.thompson@student.edu',
            password: hashedPassword,
            role: 'student',
        },
    });

    console.log(`✅ Created teacher auth with ID: ${teacherAuth.id}`);
    console.log(`✅ Created student auth with ID: ${studentAuth.id}`);

    console.log('✅ Created 1 teacher auth and 1 student auth');
    console.log('✨ Users Seeding Finished');
}

if (require.main === module) {
    seedUsers()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
