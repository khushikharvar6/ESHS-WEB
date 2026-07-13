import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit feedback' })
  async create(@Body() dto: CreateFeedbackDto, @CurrentUser('sub') userId: string) {
    return this.feedbackService.create(dto, userId);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all feedback' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'patientId', required: false })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('patientId') patientId?: string,
  ) {
    return this.feedbackService.findAll(page, limit, patientId);
  }

  @Get('stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get feedback statistics' })
  async getStats() {
    return this.feedbackService.getStats();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get feedback by ID' })
  async findById(@Param('id') id: string) {
    return this.feedbackService.findById(id);
  }
}
