import 'dotenv/config';
import { PrismaClient as PrismaAcademicClient } from '@prisma/client-academic';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL_ACADEMIC,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaAcademicClient({ adapter });

export async function seedAcademic() {
    console.log('🌱 Seeding Academic Database...');

    // Clear existing data (in reverse order of dependencies)
    await prisma.enrollment.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.specialty.deleteMany();
    await prisma.cycle.deleteMany();
    await prisma.degree.deleteMany();

    console.log('✅ Cleared existing academic data');

    // Create Degrees
    const degrees = await Promise.all([
        prisma.degree.create({
            data: {
                name: 'Computer Science',
                duration: '4 years',
            },
        }),
        prisma.degree.create({
            data: {
                name: 'Business Administration',
                duration: '4 years',
            },
        }),
        prisma.degree.create({
            data: {
                name: 'Engineering',
                duration: '5 years',
            },
        }),
    ]);
    console.log('✅ Created 3 degrees');

    // Create Cycles
    const cycles = await Promise.all([
        prisma.cycle.create({
            data: {
                name: 'Fall 2024',
                description: 'Fall semester 2024',
            },
        }),
        prisma.cycle.create({
            data: {
                name: 'Spring 2025',
                description: 'Spring semester 2025',
            },
        }),
        prisma.cycle.create({
            data: {
                name: 'Summer 2025',
                description: 'Summer semester 2025',
            },
        }),
        prisma.cycle.create({
            data: {
                name: 'Fall 2025',
                description: 'Fall semester 2025',
            },
        }),
    ]);
    console.log('✅ Created 4 cycles');

    // Create Specialties
    const specialties = await Promise.all([
        prisma.specialty.create({
            data: {
                name: 'Software Engineering',
                description: 'Focus on software development and engineering practices',
            },
        }),
        prisma.specialty.create({
            data: {
                name: 'Data Science',
                description: 'Focus on data analysis and machine learning',
            },
        }),
        prisma.specialty.create({
            data: {
                name: 'Business Management',
                description: 'Focus on business operations and management',
            },
        }),
        prisma.specialty.create({
            data: {
                name: 'Finance',
                description: 'Focus on financial management and analysis',
            },
        }),
        prisma.specialty.create({
            data: {
                name: 'Civil Engineering',
                description: 'Focus on infrastructure and construction',
            },
        }),
    ]);
    console.log('✅ Created 5 specialties');

    // Create Teachers
    const teachers = await Promise.all([
        prisma.teacher.create({
            data: {
                firstName: 'John',
                lastName: 'Smith',
                email: 'john.smith@university.edu',
                phone: '555-0101',
                specialtyId: specialties[0].id,
                employmentType: 'FULL_TIME',
                isActive: true,
            },
        }),
        prisma.teacher.create({
            data: {
                firstName: 'Maria',
                lastName: 'Garcia',
                email: 'maria.garcia@university.edu',
                phone: '555-0102',
                specialtyId: specialties[1].id,
                employmentType: 'FULL_TIME',
                isActive: true,
            },
        }),
        prisma.teacher.create({
            data: {
                firstName: 'David',
                lastName: 'Johnson',
                email: 'david.johnson@university.edu',
                phone: '555-0103',
                specialtyId: specialties[2].id,
                employmentType: 'PART_TIME',
                isActive: true,
            },
        }),
        prisma.teacher.create({
            data: {
                firstName: 'Sarah',
                lastName: 'Williams',
                email: 'sarah.williams@university.edu',
                phone: '555-0104',
                specialtyId: specialties[3].id,
                employmentType: 'CONTRACT',
                isActive: true,
            },
        }),
        prisma.teacher.create({
            data: {
                firstName: 'Robert',
                lastName: 'Brown',
                email: 'robert.brown@university.edu',
                phone: '555-0105',
                specialtyId: specialties[4].id,
                employmentType: 'FULL_TIME',
                isActive: true,
            },
        }),
    ]);
    console.log('✅ Created 5 teachers');

    // Create Students
    const students = await Promise.all([
        prisma.student.create({
            data: {
                firstName: 'Alex',
                lastName: 'Thompson',
                email: 'alex.thompson@student.edu',
                degreeId: degrees[0].id,
                cycleId: cycles[0].id,
                isActive: true,
            },
        }),
        prisma.student.create({
            data: {
                firstName: 'Emily',
                lastName: 'Rodriguez',
                email: 'emily.rodriguez@student.edu',
                degreeId: degrees[1].id,
                cycleId: cycles[1].id,
                isActive: true,
            },
        }),
    ]);
    console.log('✅ Created 2 students');

    // Create Subjects
    const subjects = await Promise.all([
        prisma.subject.create({
            data: {
                name: 'Data Structures',
                description: 'Introduction to data structures and algorithms',
                teacherId: teachers[0].id,
                degreeId: degrees[0].id,
                cycleId: cycles[0].id,
                maxSlots: 30,
                availableSlots: 25,
            },
        }),
        prisma.subject.create({
            data: {
                name: 'Business Strategy',
                description: 'Corporate strategy and competitive advantage',
                teacherId: teachers[2].id,
                degreeId: degrees[1].id,
                cycleId: cycles[1].id,
                maxSlots: 30,
                availableSlots: 28,
            },
        }),
    ]);
    console.log('✅ Created 2 subjects');

    // Create Enrollments
    await prisma.enrollment.create({
        data: {
            studentId: students[0].id,
            subjectId: subjects[0].id,
            academicPeriod: '2024-1',
            status: 'ACTIVE',
        },
    });
    console.log('✅ Created 1 enrollment');

    console.log('✨ Academic Seeding Finished');
}

// Allow running directly
if (require.main === module) {
    seedAcademic()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
