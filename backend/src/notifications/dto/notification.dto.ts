import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'New Appointment Booked' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Patient Harish Parihar has been booked for Cardiology.' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 'info' })
  @IsString()
  @IsNotEmpty()
  type: string; // info, warning, success, error

  @ApiPropertyOptional({ example: '/appointments/uuid-here' })
  @IsOptional()
  @IsString()
  link?: string;
}
