import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './users.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: any, limit?: any): Promise<{
        data: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            createdAt: Date;
            department: string | null;
            role: string;
            isActive: boolean;
            lastLogin: Date | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        department: string | null;
        role: string;
        isActive: boolean;
        lastLogin: Date | null;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        department: string | null;
        role: string;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    }>;
}
