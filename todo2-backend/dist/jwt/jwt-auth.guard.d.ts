import { CanActivate, ExecutionContext } from '@nestjs/common';
import { CustomJwtService } from './custom-jwt.service';
export declare class JwtAuthGuard implements CanActivate {
    private jwtService;
    constructor(jwtService: CustomJwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
