import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateInquiryDto {
  @ApiProperty({ example: 'Harish' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Parihar' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '9978617199' })
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiPropertyOptional({ example: 'harish@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  interestedService?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  inquirySource?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdateInquiryDto extends PartialType(CreateInquiryDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lostReason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  patientId?: string;
}
