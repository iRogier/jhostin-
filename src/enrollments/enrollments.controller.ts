import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Query,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { FilterEnrollmentDto } from './dto/filter-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
    constructor(private readonly enrollmentsService: EnrollmentsService) { }

    /**
     * Create a new enrollment (transactional)
     * POST /enrollments
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
        return this.enrollmentsService.create(createEnrollmentDto);
    }

    /**
     * Get all enrollments with optional filters
     * GET /enrollments?studentId=1&academicPeriod=2024-1
     */
    @Get()
    findAll(@Query() filter: FilterEnrollmentDto) {
        return this.enrollmentsService.findAll(filter);
    }

    /**
     * Get a specific enrollment by ID
     * GET /enrollments/:id
     */
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.enrollmentsService.findOne(id);
    }

    /**
     * Get enrollments by student and period
     * GET /enrollments/student/:studentId/period/:period
     */
    @Get('student/:studentId/period/:period')
    findByStudentAndPeriod(
        @Param('studentId', ParseIntPipe) studentId: number,
        @Param('period') period: string,
    ) {
        return this.enrollmentsService.findByStudentAndPeriod(studentId, period);
    }

    /**
     * Delete an enrollment
     * DELETE /enrollments/:id
     */
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.enrollmentsService.remove(id);
    }
}
