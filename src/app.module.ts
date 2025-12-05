import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { TeachersModule } from './teachers/teachers.module';
import { DegreesModule } from './degrees/degrees.module';
import { CyclesModule } from './cycles/cycles.module';
import { SubjectsModule } from './subjects/subjects.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
    PrismaModule, StudentsModule, SpecialtiesModule, TeachersModule, DegreesModule, CyclesModule, SubjectsModule, AuthModule, ProfilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
