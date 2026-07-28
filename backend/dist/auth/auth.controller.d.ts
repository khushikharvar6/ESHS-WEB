import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
        department: string | null;
        firstName: string;
        lastName: string;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
    }>;
}
