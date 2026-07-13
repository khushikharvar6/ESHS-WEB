import { MrdService } from './mrd.service';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from './dto/mrd.dto';
export declare class MrdController {
    private readonly mrdService;
    constructor(mrdService: MrdService);
    create(dto: CreateMedicalRecordDto, userId: string): Promise<any>;
    findAll(page?: number, limit?: number, patientId?: string, search?: string): Promise<{
        data: never[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<any>;
    update(id: string, dto: UpdateMedicalRecordDto): Promise<any>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
}
