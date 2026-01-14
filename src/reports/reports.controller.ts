import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    /**
     * PART 3 - Get enrollment statistics (Native SQL)
     * GET /reports/enrollment-statistics
     */
    @Get('enrollment-statistics')
    getEnrollmentStatistics() {
        return this.reportsService.getEnrollmentStatistics();
    }

    /**
     * Get enrollment statistics by degree
     * GET /reports/enrollment-statistics/degree/:degreeId
     */
    @Get('enrollment-statistics/degree/:degreeId')
    getEnrollmentStatisticsByDegree(
        @Param('degreeId', ParseIntPipe) degreeId: number,
    ) {
        return this.reportsService.getEnrollmentStatisticsByDegree(degreeId);
    }

    /**
     * Get enrollment statistics by academic period
     * GET /reports/enrollment-statistics/period/:period
     */
    @Get('enrollment-statistics/period/:period')
    getEnrollmentStatisticsByPeriod(@Param('period') period: string) {
        return this.reportsService.getEnrollmentStatisticsByPeriod(period);
    }
}
