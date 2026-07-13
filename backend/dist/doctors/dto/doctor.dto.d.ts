export declare class CreateDoctorDto {
    firstName: string;
    lastName: string;
    fullName?: string;
    specialization: string[];
    qualification?: string;
    experienceYears?: number;
    phone?: string;
    email?: string;
    consultationFee?: number;
    followUpFee?: number;
    bio?: string;
}
declare const UpdateDoctorDto_base: import("@nestjs/common").Type<Partial<CreateDoctorDto>>;
export declare class UpdateDoctorDto extends UpdateDoctorDto_base {
}
export {};
