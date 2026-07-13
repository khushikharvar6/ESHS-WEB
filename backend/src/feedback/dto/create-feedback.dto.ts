import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FeedbackConsultationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  explanationTreatment?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  timeSpent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  clarityAdvice?: number;
}

export class FeedbackPathologyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  collectionProcess?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  comfortDuringCollection?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  timelyReports?: number;
}

export class FeedbackRadiologyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  schedulingProcess?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  explanationBeforeProcedure?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  comfortDuringProcedure?: number;
}

export class FeedbackCardiologyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  explanationCardiacEvaluation?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  qualityDiagnosticServices?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  confidenceInCare?: number;
}

export class FeedbackPulmonologyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  explanationRespiratoryCondition?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  qualityDiagnosticServices?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  satisfactionWithCare?: number;
}

export class FeedbackOphthalmologyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  eyeExaminationProcess?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  explanationDiagnosisTreatment?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  qualityEyeCareServices?: number;
}

export class FeedbackPhysiotherapyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  explanationExercisesTreatmentPlan?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  effectivenessTherapySessions?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  improvementExperienced?: number;
}

export class FeedbackPharmacyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  availabilityPrescribedMedicines?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  guidanceMedicationUsage?: number;
}

export class FeedbackPackageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  coordinationBetweenDepartments?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  smoothnessOverallProcess?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  completionWithinExpectedTime?: number;
}

export class FeedbackDayCareDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  admissionProcess?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  comfortDuringStay?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  monitoringCareProvided?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  dischargeProcess?: number;
}

export class FeedbackHomeHealthcareDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  easeBookingService?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  timelinessHomeVisit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  behaviourProfessionalismExplanation?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  infectionControlQualityStandards?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  overallQualityServices?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  servicesAvailed?: string[];
}

export class FeedbackIpdDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  admissionProcess?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  doctorCareCommunication?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  nursingCareResponsiveness?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  investigationDiagnosticServices?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  roomComfortCleanliness?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  foodQualityService?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  dischargeProcessInstructions?: number;
}

export class CreateFeedbackDto {
  @ApiProperty({ example: 'patient-uuid' })
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiPropertyOptional({ example: 'invoice-uuid' })
  @IsOptional()
  @IsString()
  invoiceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heardFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heardFromOther?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceByOther?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  serviceType?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  ratingRegistration?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  ratingQueryHandling?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  ratingWaitingTime?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  ratingStaffBehavior?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  ratingBilling?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  ratingCleanliness?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  overallSatisfaction?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  staffToAppreciate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  suggestions?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  agreedToUsage?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactNo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emailId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  signature?: string;

  @ApiPropertyOptional({ type: FeedbackConsultationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FeedbackConsultationDto)
  feedbackConsultation?: FeedbackConsultationDto;

  @ApiPropertyOptional({ type: FeedbackPathologyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FeedbackPathologyDto)
  feedbackPathology?: FeedbackPathologyDto;

  @ApiPropertyOptional({ type: FeedbackRadiologyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FeedbackRadiologyDto)
  feedbackRadiology?: FeedbackRadiologyDto;

  @ApiPropertyOptional({ type: FeedbackCardiologyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FeedbackCardiologyDto)
  feedbackCardiology?: FeedbackCardiologyDto;

  @ApiPropertyOptional({ type: FeedbackPulmonologyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FeedbackPulmonologyDto)
  feedbackPulmonology?: FeedbackPulmonologyDto;

  @ApiPropertyOptional({ type: FeedbackOphthalmologyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FeedbackOphthalmologyDto)
  feedbackOphthalmology?: FeedbackOphthalmologyDto;

  @ApiPropertyOptional({ type: FeedbackPhysiotherapyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FeedbackPhysiotherapyDto)
  feedbackPhysiotherapy?: FeedbackPhysiotherapyDto;

  @ApiPropertyOptional({ type: FeedbackPharmacyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FeedbackPharmacyDto)
  feedbackPharmacy?: FeedbackPharmacyDto;

  @ApiPropertyOptional({ type: FeedbackPackageDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FeedbackPackageDto)
  feedbackPackage?: FeedbackPackageDto;

  @ApiPropertyOptional({ type: FeedbackDayCareDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FeedbackDayCareDto)
  feedbackDayCare?: FeedbackDayCareDto;

  @ApiPropertyOptional({ type: FeedbackHomeHealthcareDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FeedbackHomeHealthcareDto)
  feedbackHomeHealthcare?: FeedbackHomeHealthcareDto;

  @ApiPropertyOptional({ type: FeedbackIpdDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FeedbackIpdDto)
  feedbackIpd?: FeedbackIpdDto;
}
