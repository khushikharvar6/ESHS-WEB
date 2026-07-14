import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto, UpdateInquiryDto } from './dto/create-inquiry.dto';
export declare class InquiryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateInquiryDto, userId?: string): Promise<any>;
    findAll(page?: number, limit?: number, status?: string, search?: string): Promise<{
        data: any;
        total: any;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<any>;
    update(id: string, dto: UpdateInquiryDto): Promise<any>;
    convert(id: string, patientId: string): Promise<any>;
    markLost(id: string, lostReason: string): Promise<any>;
}
