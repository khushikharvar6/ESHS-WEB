export declare class CreateAppointmentDto {
    uhid: string;
    inquiryId?: string;
    doctorId?: string;
    department: string;
    specialtyService?: string;
    appointmentDate: string;
    timeSlot: string;
    status?: string;
    clinicalNotes?: string;
}
declare const UpdateAppointmentDto_base: import("@nestjs/common").Type<Partial<CreateAppointmentDto>>;
export declare class UpdateAppointmentDto extends UpdateAppointmentDto_base {
}
export {};
