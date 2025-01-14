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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const custom_jwt_service_1 = require("../jwt/custom-jwt.service");
const common_2 = require("@nestjs/common");
let AuthController = class AuthController {
    constructor(authService, customJwtService) {
        this.authService = authService;
        this.customJwtService = customJwtService;
    }
    async register(firstName, lastName, email, password) {
        return this.authService.register(firstName, lastName, email, password);
    }
    verifyToken(req) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            throw new common_2.UnauthorizedException('Token is required');
        }
        try {
            const decoded = this.authService.verifyToken(token);
            return { isValid: true };
        }
        catch (error) {
            throw new common_2.UnauthorizedException('Invalid token');
        }
    }
    async login(email, password, response) {
        const { access_token } = await this.authService.login(email, password);
        if (!access_token) {
            throw new common_2.UnauthorizedException('Invalid credentials');
        }
        return response.status(200).json({
            message: 'Login successful',
            access_token,
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)('firstName')),
    __param(1, (0, common_1.Body)('lastName')),
    __param(2, (0, common_1.Body)('email')),
    __param(3, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify-token'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyToken", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('password')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        custom_jwt_service_1.CustomJwtService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map