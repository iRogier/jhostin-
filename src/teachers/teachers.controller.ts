import { Controller, Get, Post, Param, Query, Body, ParseIntPipe, Patch, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  // Controller, // Already imported
  // Get, // Already imported
  // Post, // Already imported
  // Patch, // Already imported
  // Delete, // Already imported
  // Param, // Already imported
  // Body, // Already imported
  // Query, // Already imported
  // ParseIntPipe, // Already imported
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) { }

  /**
   * Get all teachers with pagination
   * GET /teachers?page=1&limit=10
   */
  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.teachersService.findAll(page, limit);
  }

  /**
   * PART 1 - Get teachers teaching multiple subjects
   * GET /teachers/multiple-subjects
   */
  @Get('multiple-subjects')
  findMultipleSubjects() {
    return this.teachersService.findTeachingMultipleSubjects();
  }

  /**
   * PART 2 - Filter teachers with logical operations
   * GET /teachers/filter?employmentType=FULL_TIME&isActive=true&hasSubjects=true
   */
  @Get('filter')
  findByFilter(@Query() filter: FilterTeacherDto) {
    return this.teachersService.findByLogicalFilter(filter);
  }

  /**
   * Get a specific teacher by ID
   * GET /teachers/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teachersService.findOne(id);
  }

  /**
   * Create a new teacher
   * POST /teachers
   */
  @Post()
  create(@Body() createDto: CreateTeacherDto) {
    return this.teachersService.create(createDto);
  }

  /**
   * Update a teacher
   * PATCH /teachers/:id
   */
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.teachersService.update(id, updateDto);
  }

  /**
   * Delete a teacher
   * DELETE /teachers/:id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teachersService.remove(id);
  }
}
