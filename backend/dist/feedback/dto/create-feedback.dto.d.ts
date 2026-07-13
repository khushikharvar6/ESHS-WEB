export declare class FeedbackConsultationDto {
    explanationTreatment?: number;
    timeSpent?: number;
    clarityAdvice?: number;
}
export declare class FeedbackPathologyDto {
    collectionProcess?: number;
    comfortDuringCollection?: number;
    timelyReports?: number;
}
export declare class FeedbackRadiologyDto {
    schedulingProcess?: number;
    explanationBeforeProcedure?: number;
    comfortDuringProcedure?: number;
}
export declare class FeedbackCardiologyDto {
    explanationCardiacEvaluation?: number;
    qualityDiagnosticServices?: number;
    confidenceInCare?: number;
}
export declare class FeedbackPulmonologyDto {
    explanationRespiratoryCondition?: number;
    qualityDiagnosticServices?: number;
    satisfactionWithCare?: number;
}
export declare class FeedbackOphthalmologyDto {
    eyeExaminationProcess?: number;
    explanationDiagnosisTreatment?: number;
    qualityEyeCareServices?: number;
}
export declare class FeedbackPhysiotherapyDto {
    explanationExercisesTreatmentPlan?: number;
    effectivenessTherapySessions?: number;
    improvementExperienced?: number;
}
export declare class FeedbackPharmacyDto {
    availabilityPrescribedMedicines?: number;
    guidanceMedicationUsage?: number;
}
export declare class FeedbackPackageDto {
    coordinationBetweenDepartments?: number;
    smoothnessOverallProcess?: number;
    completionWithinExpectedTime?: number;
}
export declare class FeedbackDayCareDto {
    admissionProcess?: number;
    comfortDuringStay?: number;
    monitoringCareProvided?: number;
    dischargeProcess?: number;
}
export declare class FeedbackHomeHealthcareDto {
    easeBookingService?: number;
    timelinessHomeVisit?: number;
    behaviourProfessionalismExplanation?: number;
    infectionControlQualityStandards?: number;
    overallQualityServices?: number;
    servicesAvailed?: string[];
}
export declare class FeedbackIpdDto {
    admissionProcess?: number;
    doctorCareCommunication?: number;
    nursingCareResponsiveness?: number;
    investigationDiagnosticServices?: number;
    roomComfortCleanliness?: number;
    foodQualityService?: number;
    dischargeProcessInstructions?: number;
}
export declare class CreateFeedbackDto {
    patientId: string;
    invoiceId?: string;
    heardFrom?: string;
    heardFromOther?: string;
    referenceBy?: string;
    referenceByOther?: string;
    serviceType?: string;
    ratingRegistration?: number;
    ratingQueryHandling?: number;
    ratingWaitingTime?: number;
    ratingStaffBehavior?: number;
    ratingBilling?: number;
    ratingCleanliness?: number;
    overallSatisfaction?: number;
    staffToAppreciate?: string;
    suggestions?: string;
    agreedToUsage?: boolean;
    contactNo?: string;
    emailId?: string;
    signature?: string;
    feedbackConsultation?: FeedbackConsultationDto;
    feedbackPathology?: FeedbackPathologyDto;
    feedbackRadiology?: FeedbackRadiologyDto;
    feedbackCardiology?: FeedbackCardiologyDto;
    feedbackPulmonology?: FeedbackPulmonologyDto;
    feedbackOphthalmology?: FeedbackOphthalmologyDto;
    feedbackPhysiotherapy?: FeedbackPhysiotherapyDto;
    feedbackPharmacy?: FeedbackPharmacyDto;
    feedbackPackage?: FeedbackPackageDto;
    feedbackDayCare?: FeedbackDayCareDto;
    feedbackHomeHealthcare?: FeedbackHomeHealthcareDto;
    feedbackIpd?: FeedbackIpdDto;
}
