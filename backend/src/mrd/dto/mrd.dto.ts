import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateMedicalRecordDto {
  @ApiProperty({ example: 'patient-uuid' })
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ example: 'Lab Report' })
  @IsString()
  @IsNotEmpty()
  recordType: string; // e.g. Consultation, Lab Report, Radiology Report, Prescription, Discharge Summary

  @ApiProperty({ example: 'CBC Blood Report July 2026' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://storage.googleapis.com/es-healthcare/records/cbc.pdf' })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional({ example: 'doctor-uuid' })
  @IsOptional()
  @IsString()
  doctorId?: string;
}

export class UpdateMedicalRecordDto extends PartialType(CreateMedicalRecordDto) {}
