import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/create-patient.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new patient' })
  async create(
    @Body() dto: CreatePatientDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.patientsService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'List all patients with pagination and filters' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'department', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('department') department?: string,
    @Query('status') status?: string,
  ) {
    return this.patientsService.findAll(page, limit, search, department, status);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search patients by UHID, name, or mobile' })
  @ApiQuery({ name: 'q', required: true })
  async search(@Query('q') query: string) {
    return this.patientsService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by ID with related records' })
  async findById(@Param('id') id: string) {
    return this.patientsService.findById(id);
  }

  @Get('uhid/:uhid')
  @ApiOperation({ summary: 'Get patient by UHID' })
  async findByUhid(@Param('uhid') uhid: string) {
    return this.patientsService.findByUhid(uhid);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update patient details' })
  async update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.patientsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate patient' })
  async deactivate(@Param('id') id: string) {
    return this.patientsService.deactivate(id);
  }
}
