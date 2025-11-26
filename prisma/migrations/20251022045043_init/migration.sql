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

    CONSTRAINT "students_pkey" PRIMARY KEY ("student_id")
);

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
