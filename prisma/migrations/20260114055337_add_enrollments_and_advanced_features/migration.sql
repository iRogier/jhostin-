/*
  Warnings:

  - You are about to drop the `student_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teacher_profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DROPPED', 'FAILED');

-- DropTable
DROP TABLE "student_profiles";

-- DropTable
DROP TABLE "teacher_profiles";

-- CreateTable
CREATE TABLE "specialties" (
    "specialty_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("specialty_id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "teacher_id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "specialty_id" INTEGER,
    "employment_type" "EmploymentType" NOT NULL DEFAULT 'FULL_TIME',
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateTable
CREATE TABLE "degrees" (
    "degree_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "duration" VARCHAR(100),

    CONSTRAINT "degrees_pkey" PRIMARY KEY ("degree_id")
);

-- CreateTable
CREATE TABLE "cycles" (
    "cycle_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "cycles_pkey" PRIMARY KEY ("cycle_id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "subject_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "teacher_id" INTEGER,
    "degree_id" INTEGER,
    "cycle_id" INTEGER,
    "max_slots" INTEGER NOT NULL DEFAULT 30,
    "available_slots" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("subject_id")
);

-- CreateTable
CREATE TABLE "students" (
    "student_id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "degree_id" INTEGER,
    "cycle_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "students_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "enrollment_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "academic_period" VARCHAR(50) NOT NULL,
    "enrollment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("enrollment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teachers_email_key" ON "teachers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_student_id_subject_id_academic_period_key" ON "enrollments"("student_id", "subject_id", "academic_period");

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("specialty_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_degree_id_fkey" FOREIGN KEY ("degree_id") REFERENCES "degrees"("degree_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("cycle_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_degree_id_fkey" FOREIGN KEY ("degree_id") REFERENCES "degrees"("degree_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("cycle_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE RESTRICT ON UPDATE CASCADE;
