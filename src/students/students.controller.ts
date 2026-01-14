import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { FilterStudentDto } from './dto/filter-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }

  /**
   * Get all students
   * GET /students
   */
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  /**
   * PART 1 - Get all active students with their degree
   * GET /students/active-with-degree
   */
  @Get('active-with-degree')
  findActiveWithDegree() {
    return this.studentsService.findActiveStudentsWithDegree();
  }

  /**
   * PART 2 - Complex filter with logical operations
   * GET /students/filter?isActive=true&degreeId=1&academicPeriod=2024-1
   */
  @Get('filter')
  findByFilter(@Query() filter: FilterStudentDto) {
    return this.studentsService.findByComplexFilter(filter);
  }

  /**
   * Get a specific student by ID
   * GET /students/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  /**
   * PART 1 - Get student enrollments by academic period
   * GET /students/:id/enrollments?period=2024-1
   */
  @Get(':id/enrollments')
  findEnrollments(
    @Param('id', ParseIntPipe) id: number,
    @Query('period') period: string,
  ) {
    return this.studentsService.findEnrollmentsByPeriod(id, period);
  }

  /**
   * Update a student
   * PATCH /students/:id
   */
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.studentsService.update(id, updateDto);
  }

  /**
   * Delete a student
   * DELETE /students/:id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.remove(id);
  }
}