import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { NcService } from './nc.service';
import { CreateNcDto, ResolveNcDto } from './dto/nc.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('NC')
@ApiBearerAuth()
@Controller('nc')
export class NcController {
  constructor(private readonly ncService: NcService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'QA_MANAGER', 'FRONT_OFFICE', 'BILLING_STAFF')
  @ApiOperation({ summary: 'Log a new non-conformance (NC)' })
  async create(@Body() dto: CreateNcDto, @CurrentUser('sub') userId: string) {
    return this.ncService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all NC logs with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'patientId', required: false })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
    @Query('severity') severity?: string,
    @Query('patientId') patientId?: string,
  ) {
    return this.ncService.findAll(page, limit, status, severity, patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get NC log by ID' })
  async findById(@Param('id') id: string) {
    return this.ncService.findById(id);
  }

  @Post(':id/resolve')
  @Roles('SUPER_ADMIN', 'ADMIN', 'QA_MANAGER')
  @ApiOperation({ summary: 'Resolve a non-conformance' })
  async resolve(
    @Param('id') id: string,
    @Body() dto: ResolveNcDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.ncService.resolve(id, dto, userId);
  }

  @Post(':id/close')
  @Roles('SUPER_ADMIN', 'ADMIN', 'QA_MANAGER')
  @ApiOperation({ summary: 'Close a non-conformance log' })
  async close(@Param('id') id: string) {
    return this.ncService.close(id);
  }
}
