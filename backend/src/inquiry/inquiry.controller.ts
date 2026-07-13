import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto, UpdateInquiryDto } from './dto/create-inquiry.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Inquiries')
@ApiBearerAuth()
@Controller('inquiries')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  @ApiOperation({ summary: 'Create new inquiry' })
  async create(
    @Body() dto: CreateInquiryDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.inquiryService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'List inquiries with filters' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.inquiryService.findAll(page, limit, status, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inquiry by ID' })
  async findById(@Param('id') id: string) {
    return this.inquiryService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update inquiry' })
  async update(@Param('id') id: string, @Body() dto: UpdateInquiryDto) {
    return this.inquiryService.update(id, dto);
  }

  @Post(':id/convert')
  @ApiOperation({ summary: 'Convert inquiry to patient' })
  async convert(
    @Param('id') id: string,
    @Body('patientId') patientId: string,
  ) {
    return this.inquiryService.convert(id, patientId);
  }

  @Post(':id/lost')
  @ApiOperation({ summary: 'Mark inquiry as lost' })
  async markLost(
    @Param('id') id: string,
    @Body('lostReason') lostReason: string,
  ) {
    return this.inquiryService.markLost(id, lostReason);
  }
}
