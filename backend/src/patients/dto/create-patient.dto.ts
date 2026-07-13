import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreatePatientDto {
  @IsOptional() @IsString() salutation?: string;
  @IsString() @IsNotEmpty() firstName: string;
  @IsOptional() @IsString() middleName?: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsOptional() @IsNumber() age?: number;
  @IsOptional() @IsString() dob?: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() bloodGroup?: string;
  @IsOptional() @IsString() maritalStatus?: string;
  
  @IsOptional() @IsString() mobileNo?: string;
  @IsOptional() @IsString() alternateMobile?: string;
  @IsOptional() @IsString() emailAddress?: string;
  @IsOptional() @IsString() residentialAddress?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() pincode?: string;
  
  @IsOptional() @IsString() emergencyContactName?: string;
  @IsOptional() @IsString() emergencyRelationship?: string;
  @IsOptional() @IsString() emergencyPhoneNumber?: string;
  
  @IsOptional() @IsString() patientCategory?: string;
  @IsOptional() @IsString() careType?: string;
  @IsOptional() @IsString() assignedDepartmentServices?: string;
  @IsOptional() @IsString() assignedDepartment?: string;
  @IsOptional() @IsString() service?: string;

  // Insurance
  @IsOptional() @IsString() insuranceProvider?: string;
  @IsOptional() @IsString() policyNumber?: string;
  @IsOptional() @IsString() tpaNetwork?: string;
  @IsOptional() @IsString() insuranceContact?: string;
  @IsOptional() @IsString() insuranceNotes?: string;

  // Corporate
  @IsOptional() @IsString() companyName?: string;
  @IsOptional() @IsString() corporateId?: string;
  @IsOptional() @IsString() employeeId?: string;
  @IsOptional() @IsString() companyContact?: string;
  @IsOptional() @IsString() corporateAddress?: string;

  // Extra frontend
  @IsOptional() @IsString() registeredOn?: string;
  @IsOptional() @IsString() lastVisit?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() initials?: string;
  @IsOptional() @IsString() inquiryId?: string;
  @IsOptional() @IsString() appointmentId?: string;
  @IsOptional() @IsBoolean() vip?: boolean;
}

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}
