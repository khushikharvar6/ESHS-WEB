import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendSmsDto {
  @ApiPropertyOptional({ example: 'patient-uuid-here' })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiProperty({ example: '+919978617199' })
  @IsString()
  @IsNotEmpty()
  recipient: string;

  @ApiProperty({ example: 'Dear Harish, welcome to ES Healthcare Centre! Your UHID is ESHS2026-00001.' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 'UHID_REGISTRATION' })
  @IsString()
  @IsNotEmpty()
  type: string; // e.g. UHID_REGISTRATION, BILL_SHARE, APPOINTMENT_REMINDER, FEEDBACK_LINK
}
