export declare class CreateMedicalRecordDto {
    patientId: string;
    recordType: string;
    title: string;
    description?: string;
    fileUrl?: string;
    doctorId?: string;
}
declare const UpdateMedicalRecordDto_base: import("@nestjs/common").Type<Partial<CreateMedicalRecordDto>>;
export declare class UpdateMedicalRecordDto extends UpdateMedicalRecordDto_base {
}
export {};
