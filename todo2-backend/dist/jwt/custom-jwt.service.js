"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomJwtService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const common_2 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let CustomJwtService = class CustomJwtService {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    generateToken(payload) {
        const secret = this.configService.get('superdupersecret');
        const expiresIn = '1h';
        return this.jwtService.sign(payload, { secret, expiresIn });
    }
    verify(token) {
        const secret = this.configService.get('superdupersecret');
        try {
            return this.jwtService.verify(token, { secret });
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new common_2.UnauthorizedException('Token has expired');
            }
            throw new common_2.UnauthorizedException('Invalid or expired token');
        }
    }
    decode(token) {
        return this.jwtService.decode(token);
    }
};
exports.CustomJwtService = CustomJwtService;
exports.CustomJwtService = CustomJwtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], CustomJwtService);
//# sourceMappingURL=custom-jwt.service.js.map