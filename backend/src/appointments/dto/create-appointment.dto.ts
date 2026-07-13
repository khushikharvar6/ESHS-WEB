import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'ESHS2026-00001' })
  @IsString()
  @IsNotEmpty()
  uhid: string = ''

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  inquiryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  doctorId?: string;

  @ApiProperty()
  @IsString()
  department: string = null as any;

  @ApiPropertyOptional({ example: 'ECG' })
  @IsOptional()
  @IsString()
  specialtyService?: string;

  @ApiProperty({ example: '2026-07-15' })
  @IsDateString()
  appointmentDate!: string;

  @ApiProperty({ example: '09:00-09:30' })
  @IsString()
  @IsNotEmpty()
  timeSlot!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clinicalNotes?: string;
}

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
