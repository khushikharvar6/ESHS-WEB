export declare class CreateInquiryDto {
    firstName: string;
    lastName: string;
    mobile: string;
    email?: string;
    interestedService?: string;
    inquirySource?: string;
    referenceBy?: string;
    status?: string;
    remarks?: string;
}
declare const UpdateInquiryDto_base: import("@nestjs/common").Type<Partial<CreateInquiryDto>>;
export declare class UpdateInquiryDto extends UpdateInquiryDto_base {
    lostReason?: string;
    patientId?: string;
}
export {};
