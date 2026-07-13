export declare class CreatePatientDto {
    salutation?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    age?: number;
    dob?: string;
    gender?: string;
    bloodGroup?: string;
    maritalStatus?: string;
    mobileNo?: string;
    alternateMobile?: string;
    emailAddress?: string;
    residentialAddress?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    emergencyContactName?: string;
    emergencyRelationship?: string;
    emergencyPhoneNumber?: string;
    patientCategory?: string;
    careType?: string;
    assignedDepartmentServices?: string;
    assignedDepartment?: string;
    service?: string;
    insuranceProvider?: string;
    policyNumber?: string;
    tpaNetwork?: string;
    insuranceContact?: string;
    insuranceNotes?: string;
    companyName?: string;
    corporateId?: string;
    employeeId?: string;
    companyContact?: string;
    corporateAddress?: string;
    registeredOn?: string;
    lastVisit?: string;
    status?: string;
    initials?: string;
    inquiryId?: string;
    appointmentId?: string;
    vip?: boolean;
}
declare const UpdatePatientDto_base: import("@nestjs/common").Type<Partial<CreatePatientDto>>;
export declare class UpdatePatientDto extends UpdatePatientDto_base {
}
export {};
