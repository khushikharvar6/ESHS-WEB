import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MrdService } from './mrd.service';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from './dto/mrd.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('MRD')
@ApiBearerAuth()
@Controller('mrd')
export class MrdController {
  constructor(private readonly mrdService: MrdService) {}

  @Post('records')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'MRD_STAFF')
  @ApiOperation({ summary: 'Add a new medical record' })
  async create(
    @Body() dto: CreateMedicalRecordDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.mrdService.create(dto, userId);
  }

  @Get('records')
  @ApiOperation({ summary: 'Get all medical records with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('patientId') patientId?: string,
    @Query('search') search?: string,
  ) {
    return this.mrdService.findAll(page, limit, patientId, search);
  }

  @Get('records/:id')
  @ApiOperation({ summary: 'Get medical record by ID' })
  async findById(@Param('id') id: string) {
    return this.mrdService.findById(id);
  }

  @Patch('records/:id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'MRD_STAFF')
  @ApiOperation({ summary: 'Update a medical record' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMedicalRecordDto,
  ) {
    return this.mrdService.update(id, dto);
  }

  @Delete('records/:id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MRD_STAFF')
  @ApiOperation({ summary: 'Delete a medical record' })
  async delete(@Param('id') id: string) {
    return this.mrdService.delete(id);
  }
}
