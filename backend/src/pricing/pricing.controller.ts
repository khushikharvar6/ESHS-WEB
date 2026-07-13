import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Pricing')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Public()
  @Get('tests')
  @ApiOperation({ summary: 'Get all test prices' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'department', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getTests(
    @Query('category') category?: string,
    @Query('department') department?: string,
    @Query('search') search?: string,
  ) {
    return this.pricingService.getTests(category, department, search);
  }

  @Public()
  @Get('tests/:id')
  @ApiOperation({ summary: 'Get test by ID' })
  async getTestById(@Param('id') id: string) {
    return this.pricingService.getTestById(id);
  }

  @Public()
  @Get('services')
  @ApiOperation({ summary: 'Get all service prices' })
  async getServices() {
    return this.pricingService.getServices();
  }

  @Public()
  @Get('packages')
  @ApiOperation({ summary: 'Get all packages with items' })
  async getPackages() {
    return this.pricingService.getPackages();
  }

  @Public()
  @Get('packages/:id')
  @ApiOperation({ summary: 'Get package by ID' })
  async getPackageById(@Param('id') id: string) {
    return this.pricingService.getPackageById(id);
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all test categories' })
  async getCategories() {
    return this.pricingService.getTestCategories();
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search across tests, packages, and services' })
  @ApiQuery({ name: 'q', required: true })
  async search(@Query('q') query: string) {
    return this.pricingService.searchItems(query);
  }
}
