"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const user_entity_1 = require("./user/user.entity");
const user_module_1 = require("./user/user.module");
const to_do_module_1 = require("./to-do/to-do.module");
const todo_entity_1 = require("./to-do/todo.entity");
const jwt_module_1 = require("./jwt/jwt.module");
const jwt_1 = require("@nestjs/jwt");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'todo2-app.sqlite',
                entities: [user_entity_1.User, todo_entity_1.ToDo],
                synchronize: true,
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            to_do_module_1.ToDoModule,
            jwt_1.JwtModule.register({
                secret: 'superdupersecret',
                signOptions: { expiresIn: '1h' },
            }),
            jwt_module_1.JwtAuthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map