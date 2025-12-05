/*
  Warnings:

  - You are about to drop the `student_auth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teacher_auth` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "student_auth";

-- DropTable
DROP TABLE "teacher_auth";

-- CreateTable
CREATE TABLE "teacher_profiles" (
    "teacher_id" INTEGER NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "bio" TEXT,
    "avatar" VARCHAR(500),
    "specialty_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_profiles_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "student_id" INTEGER NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "bio" TEXT,
    "avatar" VARCHAR(500),
    "degree_id" INTEGER,
    "cycle_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("student_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profiles_email_key" ON "teacher_profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_email_key" ON "student_profiles"("email");
