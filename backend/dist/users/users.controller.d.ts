import { UsersService } from './users.service';
import { UpdateUserDto } from './users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            email: string;
            role: string;
            firstName: string;
            lastName: string;
            department: string | null;
            isActive: boolean;
            lastLogin: Date | null;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
        department: string | null;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
        department: string | null;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }>;
}
