import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class CustomJwtService {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    generateToken(payload: any): string;
    verify(token: string): any;
    decode(token: string): any;
}
