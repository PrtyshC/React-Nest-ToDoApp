import { UserService } from '../user/user.service';
import { CustomJwtService } from '../jwt/custom-jwt.service';
import { JwtPayload } from '../jwt/jwt.payload.interface';
export declare class AuthService {
    private readonly userService;
    private jwtService;
    constructor(userService: UserService, jwtService: CustomJwtService);
    register(firstName: string, lastName: string, email: string, password: string): Promise<import("../user/user.entity").User>;
    login(email: string, password: string): Promise<{
        access_token: string;
    }>;
    verifyToken(token: string): JwtPayload;
}
