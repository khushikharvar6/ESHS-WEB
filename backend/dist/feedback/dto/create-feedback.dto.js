"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFeedbackDto = exports.FeedbackIpdDto = exports.FeedbackHomeHealthcareDto = exports.FeedbackDayCareDto = exports.FeedbackPackageDto = exports.FeedbackPharmacyDto = exports.FeedbackPhysiotherapyDto = exports.FeedbackOphthalmologyDto = exports.FeedbackPulmonologyDto = exports.FeedbackCardiologyDto = exports.FeedbackRadiologyDto = exports.FeedbackPathologyDto = exports.FeedbackConsultationDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class FeedbackConsultationDto {
}
exports.FeedbackConsultationDto = FeedbackConsultationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackConsultationDto.prototype, "explanationTreatment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackConsultationDto.prototype, "timeSpent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackConsultationDto.prototype, "clarityAdvice", void 0);
class FeedbackPathologyDto {
}
exports.FeedbackPathologyDto = FeedbackPathologyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackPathologyDto.prototype, "collectionProcess", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackPathologyDto.prototype, "comfortDuringCollection", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackPathologyDto.prototype, "timelyReports", void 0);
class FeedbackRadiologyDto {
}
exports.FeedbackRadiologyDto = FeedbackRadiologyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackRadiologyDto.prototype, "schedulingProcess", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackRadiologyDto.prototype, "explanationBeforeProcedure", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackRadiologyDto.prototype, "comfortDuringProcedure", void 0);
class FeedbackCardiologyDto {
}
exports.FeedbackCardiologyDto = FeedbackCardiologyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackCardiologyDto.prototype, "explanationCardiacEvaluation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackCardiologyDto.prototype, "qualityDiagnosticServices", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackCardiologyDto.prototype, "confidenceInCare", void 0);
class FeedbackPulmonologyDto {
}
exports.FeedbackPulmonologyDto = FeedbackPulmonologyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackPulmonologyDto.prototype, "explanationRespiratoryCondition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackPulmonologyDto.prototype, "qualityDiagnosticServices", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackPulmonologyDto.prototype, "satisfactionWithCare", void 0);
class FeedbackOphthalmologyDto {
}
exports.FeedbackOphthalmologyDto = FeedbackOphthalmologyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackOphthalmologyDto.prototype, "eyeExaminationProcess", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackOphthalmologyDto.prototype, "explanationDiagnosisTreatment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackOphthalmologyDto.prototype, "qualityEyeCareServices", void 0);
class FeedbackPhysiotherapyDto {
}
exports.FeedbackPhysiotherapyDto = FeedbackPhysiotherapyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackPhysiotherapyDto.prototype, "explanationExercisesTreatmentPlan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackPhysiotherapyDto.prototype, "effectivenessTherapySessions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackPhysiotherapyDto.prototype, "improvementExperienced", void 0);
class FeedbackPharmacyDto {
}
exports.FeedbackPharmacyDto = FeedbackPharmacyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackPharmacyDto.prototype, "availabilityPrescribedMedicines", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackPharmacyDto.prototype, "guidanceMedicationUsage", void 0);
class FeedbackPackageDto {
}
exports.FeedbackPackageDto = FeedbackPackageDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackPackageDto.prototype, "coordinationBetweenDepartments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackPackageDto.prototype, "smoothnessOverallProcess", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackPackageDto.prototype, "completionWithinExpectedTime", void 0);
class FeedbackDayCareDto {
}
exports.FeedbackDayCareDto = FeedbackDayCareDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackDayCareDto.prototype, "admissionProcess", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackDayCareDto.prototype, "comfortDuringStay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackDayCareDto.prototype, "monitoringCareProvided", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackDayCareDto.prototype, "dischargeProcess", void 0);
class FeedbackHomeHealthcareDto {
}
exports.FeedbackHomeHealthcareDto = FeedbackHomeHealthcareDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackHomeHealthcareDto.prototype, "easeBookingService", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackHomeHealthcareDto.prototype, "timelinessHomeVisit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackHomeHealthcareDto.prototype, "behaviourProfessionalismExplanation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackHomeHealthcareDto.prototype, "infectionControlQualityStandards", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackHomeHealthcareDto.prototype, "overallQualityServices", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], FeedbackHomeHealthcareDto.prototype, "servicesAvailed", void 0);
class FeedbackIpdDto {
}
exports.FeedbackIpdDto = FeedbackIpdDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackIpdDto.prototype, "admissionProcess", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackIpdDto.prototype, "doctorCareCommunication", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackIpdDto.prototype, "nursingCareResponsiveness", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackIpdDto.prototype, "investigationDiagnosticServices", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackIpdDto.prototype, "roomComfortCleanliness", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackIpdDto.prototype, "foodQualityService", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeedbackIpdDto.prototype, "dischargeProcessInstructions", void 0);
class CreateFeedbackDto {
}
exports.CreateFeedbackDto = CreateFeedbackDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'patient-uuid' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'invoice-uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "invoiceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "heardFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "heardFromOther", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "referenceBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "referenceByOther", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "serviceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateFeedbackDto.prototype, "ratingRegistration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateFeedbackDto.prototype, "ratingQueryHandling", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateFeedbackDto.prototype, "ratingWaitingTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateFeedbackDto.prototype, "ratingStaffBehavior", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateFeedbackDto.prototype, "ratingBilling", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateFeedbackDto.prototype, "ratingCleanliness", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateFeedbackDto.prototype, "overallSatisfaction", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "staffToAppreciate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "suggestions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFeedbackDto.prototype, "agreedToUsage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "contactNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "emailId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "signature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: FeedbackConsultationDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FeedbackConsultationDto),
    __metadata("design:type", FeedbackConsultationDto)
], CreateFeedbackDto.prototype, "feedbackConsultation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: FeedbackPathologyDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FeedbackPathologyDto),
    __metadata("design:type", FeedbackPathologyDto)
], CreateFeedbackDto.prototype, "feedbackPathology", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: FeedbackRadiologyDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FeedbackRadiologyDto),
    __metadata("design:type", FeedbackRadiologyDto)
], CreateFeedbackDto.prototype, "feedbackRadiology", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: FeedbackCardiologyDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FeedbackCardiologyDto),
    __metadata("design:type", FeedbackCardiologyDto)
], CreateFeedbackDto.prototype, "feedbackCardiology", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: FeedbackPulmonologyDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FeedbackPulmonologyDto),
    __metadata("design:type", FeedbackPulmonologyDto)
], CreateFeedbackDto.prototype, "feedbackPulmonology", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: FeedbackOphthalmologyDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FeedbackOphthalmologyDto),
    __metadata("design:type", FeedbackOphthalmologyDto)
], CreateFeedbackDto.prototype, "feedbackOphthalmology", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: FeedbackPhysiotherapyDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FeedbackPhysiotherapyDto),
    __metadata("design:type", FeedbackPhysiotherapyDto)
], CreateFeedbackDto.prototype, "feedbackPhysiotherapy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: FeedbackPharmacyDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FeedbackPharmacyDto),
    __metadata("design:type", FeedbackPharmacyDto)
], CreateFeedbackDto.prototype, "feedbackPharmacy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: FeedbackPackageDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FeedbackPackageDto),
    __metadata("design:type", FeedbackPackageDto)
], CreateFeedbackDto.prototype, "feedbackPackage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: FeedbackDayCareDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FeedbackDayCareDto),
    __metadata("design:type", FeedbackDayCareDto)
], CreateFeedbackDto.prototype, "feedbackDayCare", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: FeedbackHomeHealthcareDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FeedbackHomeHealthcareDto),
    __metadata("design:type", FeedbackHomeHealthcareDto)
], CreateFeedbackDto.prototype, "feedbackHomeHealthcare", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: FeedbackIpdDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FeedbackIpdDto),
    __metadata("design:type", FeedbackIpdDto)
], CreateFeedbackDto.prototype, "feedbackIpd", void 0);
//# sourceMappingURL=create-feedback.dto.js.map