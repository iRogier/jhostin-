import { PrismaClient as PrismaAcademicClient } from '@prisma/client-academic';

const prisma = new PrismaAcademicClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Clear existing data (in reverse order of dependencies)
    await prisma.enrollment.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.specialty.deleteMany();
    await prisma.cycle.deleteMany();
    await prisma.degree.deleteMany();

    console.log('✅ Cleared existing data');

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

    // Create Teachers (mix of employment types and active status)
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
        prisma.teacher.create({
            data: {
                firstName: 'Emma',
                lastName: 'Davis',
                email: 'emma.davis@university.edu',
                phone: '555-0106',
                specialtyId: specialties[0].id,
                employmentType: 'PART_TIME',
                isActive: false, // Inactive teacher
            },
        }),
        prisma.teacher.create({
            data: {
                firstName: 'Michael',
                lastName: 'Wilson',
                email: 'michael.wilson@university.edu',
                phone: '555-0107',
                specialtyId: specialties[1].id,
                employmentType: 'FULL_TIME',
                isActive: true,
            },
        }),
        prisma.teacher.create({
            data: {
                firstName: 'Lisa',
                lastName: 'Anderson',
                email: 'lisa.anderson@university.edu',
                phone: '555-0108',
                specialtyId: specialties[2].id,
                employmentType: 'CONTRACT',
                isActive: true,
            },
        }),
        prisma.teacher.create({
            data: {
                firstName: 'James',
                lastName: 'Martinez',
                email: 'james.martinez@university.edu',
                phone: '555-0109',
                specialtyId: specialties[3].id,
                employmentType: 'FULL_TIME',
                isActive: true,
            },
        }),
        prisma.teacher.create({
            data: {
                firstName: 'Jennifer',
                lastName: 'Taylor',
                email: 'jennifer.taylor@university.edu',
                phone: '555-0110',
                specialtyId: specialties[4].id,
                employmentType: 'PART_TIME',
                isActive: true,
            },
        }),
    ]);
    console.log('✅ Created 10 teachers');

    // Create Students (mix of active and inactive)
    const students = await Promise.all([
        // Computer Science students
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
                degreeId: degrees[0].id,
                cycleId: cycles[1].id,
                isActive: true,
            },
        }),
        prisma.student.create({
            data: {
                firstName: 'Daniel',
                lastName: 'White',
                email: 'daniel.white@student.edu',
                degreeId: degrees[0].id,
                cycleId: cycles[0].id,
                isActive: true,
            },
        }),
        prisma.student.create({
            data: {
                firstName: 'Sophia',
                lastName: 'Lee',
                email: 'sophia.lee@student.edu',
                degreeId: degrees[0].id,
                cycleId: cycles[1].id,
                isActive: false, // Inactive student
            },
        }),
        // Business Administration students
        prisma.student.create({
            data: {
                firstName: 'William',
                lastName: 'Harris',
                email: 'william.harris@student.edu',
                degreeId: degrees[1].id,
                cycleId: cycles[0].id,
                isActive: true,
            },
        }),
        prisma.student.create({
            data: {
                firstName: 'Olivia',
                lastName: 'Clark',
                email: 'olivia.clark@student.edu',
                degreeId: degrees[1].id,
                cycleId: cycles[1].id,
                isActive: true,
            },
        }),
        prisma.student.create({
            data: {
                firstName: 'Noah',
                lastName: 'Lewis',
                email: 'noah.lewis@student.edu',
                degreeId: degrees[1].id,
                cycleId: cycles[0].id,
                isActive: true,
            },
        }),
        prisma.student.create({
            data: {
                firstName: 'Ava',
                lastName: 'Walker',
                email: 'ava.walker@student.edu',
                degreeId: degrees[1].id,
                cycleId: cycles[1].id,
                isActive: false, // Inactive student
            },
        }),
        // Engineering students
        prisma.student.create({
            data: {
                firstName: 'Ethan',
                lastName: 'Young',
                email: 'ethan.young@student.edu',
                degreeId: degrees[2].id,
                cycleId: cycles[0].id,
                isActive: true,
            },
        }),
        prisma.student.create({
            data: {
                firstName: 'Isabella',
                lastName: 'Allen',
                email: 'isabella.allen@student.edu',
                degreeId: degrees[2].id,
                cycleId: cycles[1].id,
                isActive: true,
            },
        }),
        // More students for testing
        ...Array.from({ length: 10 }, (_, i) => ({
            firstName: `Student${i + 11}`,
            lastName: `LastName${i + 11}`,
            email: `student${i + 11}@student.edu`,
            degreeId: degrees[i % 3].id,
            cycleId: cycles[i % 4].id,
            isActive: i % 5 !== 0, // Every 5th student is inactive
        })).map((data) => prisma.student.create({ data })),
    ]);
    console.log('✅ Created 20 students');

    // Create Subjects (with varied available slots)
    const subjects = await Promise.all([
        // Computer Science subjects
        prisma.subject.create({
            data: {
                name: 'Data Structures',
                description: 'Introduction to data structures and algorithms',
                teacherId: teachers[0].id,
                degreeId: degrees[0].id,
                cycleId: cycles[0].id,
                maxSlots: 30,
                availableSlots: 25, // Some enrollments
            },
        }),
        prisma.subject.create({
            data: {
                name: 'Database Systems',
                description: 'Relational databases and SQL',
                teacherId: teachers[0].id,
                degreeId: degrees[0].id,
                cycleId: cycles[0].id,
                maxSlots: 30,
                availableSlots: 20,
            },
        }),
        prisma.subject.create({
            data: {
                name: 'Machine Learning',
                description: 'Introduction to machine learning algorithms',
                teacherId: teachers[1].id,
                degreeId: degrees[0].id,
                cycleId: cycles[1].id,
                maxSlots: 25,
                availableSlots: 22,
            },
        }),
        // Business Administration subjects
        prisma.subject.create({
            data: {
                name: 'Business Strategy',
                description: 'Corporate strategy and competitive advantage',
                teacherId: teachers[2].id,
                degreeId: degrees[1].id,
                cycleId: cycles[0].id,
                maxSlots: 30,
                availableSlots: 28,
            },
        }),
        prisma.subject.create({
            data: {
                name: 'Financial Accounting',
                description: 'Principles of financial accounting',
                teacherId: teachers[3].id,
                degreeId: degrees[1].id,
                cycleId: cycles[0].id,
                maxSlots: 30,
                availableSlots: 26,
            },
        }),
        prisma.subject.create({
            data: {
                name: 'Marketing Management',
                description: 'Marketing principles and strategies',
                teacherId: teachers[2].id,
                degreeId: degrees[1].id,
                cycleId: cycles[1].id,
                maxSlots: 28,
                availableSlots: 25,
            },
        }),
        // Engineering subjects
        prisma.subject.create({
            data: {
                name: 'Structural Engineering',
                description: 'Design and analysis of structures',
                teacherId: teachers[4].id,
                degreeId: degrees[2].id,
                cycleId: cycles[0].id,
                maxSlots: 25,
                availableSlots: 23,
            },
        }),
        prisma.subject.create({
            data: {
                name: 'Fluid Mechanics',
                description: 'Principles of fluid mechanics',
                teacherId: teachers[4].id,
                degreeId: degrees[2].id,
                cycleId: cycles[0].id,
                maxSlots: 25,
                availableSlots: 22,
            },
        }),
        prisma.subject.create({
            data: {
                name: 'Engineering Mathematics',
                description: 'Advanced mathematics for engineers',
                teacherId: teachers[9].id,
                degreeId: degrees[2].id,
                cycleId: cycles[1].id,
                maxSlots: 30,
                availableSlots: 28,
            },
        }),
        // Additional subjects for teachers with multiple subjects
        prisma.subject.create({
            data: {
                name: 'Web Development',
                description: 'Full-stack web development',
                teacherId: teachers[0].id, // Teacher 0 has 3 subjects total
                degreeId: degrees[0].id,
                cycleId: cycles[1].id,
                maxSlots: 30,
                availableSlots: 27,
            },
        }),
        prisma.subject.create({
            data: {
                name: 'Organizational Behavior',
                description: 'Human behavior in organizations',
                teacherId: teachers[2].id, // Teacher 2 has 3 subjects total
                degreeId: degrees[1].id,
                cycleId: cycles[0].id,
                maxSlots: 28,
                availableSlots: 26,
            },
        }),
        prisma.subject.create({
            data: {
                name: 'Construction Management',
                description: 'Project management for construction',
                teacherId: teachers[4].id, // Teacher 4 has 3 subjects total
                degreeId: degrees[2].id,
                cycleId: cycles[1].id,
                maxSlots: 25,
                availableSlots: 24,
            },
        }),
        // Subject with limited slots for testing
        prisma.subject.create({
            data: {
                name: 'Advanced AI',
                description: 'Advanced artificial intelligence topics',
                teacherId: teachers[1].id,
                degreeId: degrees[0].id,
                cycleId: cycles[1].id,
                maxSlots: 5,
                availableSlots: 2, // Very limited slots
            },
        }),
        // Subject with no slots left
        prisma.subject.create({
            data: {
                name: 'Full Course',
                description: 'This course is fully enrolled',
                teacherId: teachers[6].id,
                degreeId: degrees[0].id,
                cycleId: cycles[0].id,
                maxSlots: 20,
                availableSlots: 0, // No slots available
            },
        }),
        prisma.subject.create({
            data: {
                name: 'Software Testing',
                description: 'Testing methodologies and practices',
                teacherId: teachers[6].id,
                degreeId: degrees[0].id,
                cycleId: cycles[1].id,
                maxSlots: 30,
                availableSlots: 28,
            },
        }),
    ]);
    console.log('✅ Created 15 subjects');

    // Create Enrollments (to generate realistic data for reports)
    const enrollments = [];
    const activeStudents = students.filter((s) => (s as any).isActive !== false);

    // Enroll students in multiple subjects
    for (let i = 0; i < activeStudents.length && i < 10; i++) {
        const student = activeStudents[i];
        const studentDegree = degrees.find((d) => d.id === (student as any).degreeId);
        const degreeSubjects = subjects.filter((s) => s.degreeId === studentDegree?.id);

        // Enroll in 2-4 subjects per student
        const numEnrollments = 2 + (i % 3);
        for (let j = 0; j < Math.min(numEnrollments, degreeSubjects.length); j++) {
            try {
                const enrollment = await prisma.enrollment.create({
                    data: {
                        studentId: student.id,
                        subjectId: degreeSubjects[j].id,
                        academicPeriod: '2024-1',
                        status: 'ACTIVE',
                    },
                });
                enrollments.push(enrollment);
            } catch (error) {
                // Skip duplicates
            }
        }
    }

    // Add some enrollments for 2024-2 period
    for (let i = 0; i < 5 && i < activeStudents.length; i++) {
        const student = activeStudents[i];
        const studentDegree = degrees.find((d) => d.id === (student as any).degreeId);
        const degreeSubjects = subjects.filter(
            (s) => s.degreeId === studentDegree?.id && s.cycleId === cycles[1].id,
        );

        if (degreeSubjects.length > 0) {
            try {
                const enrollment = await prisma.enrollment.create({
                    data: {
                        studentId: student.id,
                        subjectId: degreeSubjects[0].id,
                        academicPeriod: '2024-2',
                        status: 'ACTIVE',
                    },
                });
                enrollments.push(enrollment);
            } catch (error) {
                // Skip duplicates
            }
        }
    }

    console.log(`✅ Created ${enrollments.length} enrollments`);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - ${degrees.length} Degrees`);
    console.log(`  - ${cycles.length} Cycles`);
    console.log(`  - ${specialties.length} Specialties`);
    console.log(`  - ${teachers.length} Teachers (including full-time, part-time, contract)`);
    console.log(`  - ${students.length} Students (${students.filter((s: any) => s.isActive !== false).length} active, ${students.filter((s: any) => s.isActive === false).length} inactive)`);
    console.log(`  - ${subjects.length} Subjects`);
    console.log(`  - ${enrollments.length} Enrollments`);
    console.log('\n💡 Now you can test all endpoints!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
