import { Controller, Get, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { CreateTeacherProfileDto } from './dto/create-teacher-profile.dto';

@Controller('profiles')
export class ProfilesController {
    constructor(private readonly service: ProfilesService) { }

    // Student Profile Endpoints
    @Get('students')
    findAllStudents() {
        return this.service.findAllStudents();
    }

    @Get('students/:id')
    findStudentById(@Param('id', ParseIntPipe) id: number) {
        return this.service.findStudentById(id);
    }

    @Patch('students/:id')
    updateStudentProfile(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: Partial<CreateStudentProfileDto>
    ) {
        return this.service.updateStudentProfile(id, dto);
    }

    @Delete('students/:id')
    deleteStudentProfile(@Param('id', ParseIntPipe) id: number) {
        return this.service.deleteStudentProfile(id);
    }

    // Teacher Profile Endpoints
    @Get('teachers')
    findAllTeachers() {
        return this.service.findAllTeachers();
    }

    @Get('teachers/:id')
    findTeacherById(@Param('id', ParseIntPipe) id: number) {
        return this.service.findTeacherById(id);
    }

    @Patch('teachers/:id')
    updateTeacherProfile(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: Partial<CreateTeacherProfileDto>
    ) {
        return this.service.updateTeacherProfile(id, dto);
    }

    @Delete('teachers/:id')
    deleteTeacherProfile(@Param('id', ParseIntPipe) id: number) {
        return this.service.deleteTeacherProfile(id);
    }
}
