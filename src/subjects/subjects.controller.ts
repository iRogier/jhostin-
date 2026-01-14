import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) { }

  /**
   * Get all subjects with pagination
   * GET /subjects?page=1&limit=10
   */
  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.subjectsService.findAll(Number(page), Number(limit));
  }

  /**
   * PART 1 - Get subjects by degree
   * GET /subjects/by-degree/:degreeId
   */
  @Get('by-degree/:degreeId')
  findByDegree(@Param('degreeId', ParseIntPipe) degreeId: number) {
    return this.subjectsService.findByDegree(degreeId);
  }

  /**
   * Check subject availability
   * GET /subjects/:id/availability
   */
  @Get(':id/availability')
  checkAvailability(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.checkAvailability(id);
  }

  /**
   * Get a specific subject by ID
   * GET /subjects/:id
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.findOne(id);
  }

  /**
   * Create a new subject
   * POST /subjects
   */
  @Post()
  create(@Body() dto: CreateSubjectDto) {
    return this.subjectsService.create(dto);
  }

  /**
   * Update a subject
   * PATCH /subjects/:id
   */
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.subjectsService.update(id, updateDto);
  }

  /**
   * Delete a subject
   * DELETE /subjects/:id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.remove(id);
  }
}
