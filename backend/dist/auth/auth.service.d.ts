import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            department: string | null;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
        department: string | null;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
    }>;
}
