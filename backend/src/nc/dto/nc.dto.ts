import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNcDto {
  @ApiProperty({ example: 'patient-uuid' })
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty({ example: 'Patient Aadhaar card was not uploaded during registration.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  severity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}

export class ResolveNcDto {
  @ApiProperty({ example: 'Uploaded Aadhaar card received from patient over email.' })
  @IsString()
  @IsNotEmpty()
  resolution: string;
}
