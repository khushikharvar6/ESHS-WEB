import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/create-patient.dto';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    create(dto: CreatePatientDto, userId: string): Promise<any>;
    findAll(page?: number, limit?: number, search?: string, department?: string, status?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    search(query: string): Promise<any[]>;
    findById(id: string): Promise<any>;
    findByUhid(uhid: string): Promise<any>;
    update(id: string, dto: UpdatePatientDto): Promise<any>;
    deactivate(id: string): Promise<{
        email: string | null;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        uhid: string;
        gender: string;
        dob: Date;
        mobileNo: string;
        bloodGroup: string | null;
        maritalStatus: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        pincode: string | null;
        emergencyContact: string | null;
        emergencyPhone: string | null;
        patientType: string;
    }>;
}
