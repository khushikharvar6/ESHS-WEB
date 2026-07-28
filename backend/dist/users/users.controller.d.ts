import { UsersService } from './users.service';
import { UpdateUserDto } from './users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: number, limit?: number): Promise<{
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
