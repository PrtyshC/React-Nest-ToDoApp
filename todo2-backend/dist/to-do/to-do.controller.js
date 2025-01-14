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
exports.ToDoController = void 0;
const common_1 = require("@nestjs/common");
const to_do_service_1 = require("./to-do.service");
const jwt_auth_guard_1 = require("../jwt/jwt-auth.guard");
let ToDoController = class ToDoController {
    constructor(todoService) {
        this.todoService = todoService;
    }
    async getToDos(req) {
        try {
            const userId = req.user?.sub;
            if (!userId) {
                throw new common_1.HttpException('Invalid user', common_1.HttpStatus.UNAUTHORIZED);
            }
            const todos = await this.todoService.getToDos(userId);
            return { success: true, todos };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Unable to fetch todos', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createToDo(req, title, description) {
        try {
            const userId = req.user?.sub;
            if (!userId) {
                throw new common_1.HttpException('Invalid user', common_1.HttpStatus.UNAUTHORIZED);
            }
            const todo = await this.todoService.createToDo(userId, title, description);
            return { success: true, todo };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Unable to create todo', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateToDo(id, req, title, description, completed) {
        try {
            const userId = req.user?.sub;
            if (!userId) {
                throw new common_1.HttpException('Invalid user', common_1.HttpStatus.UNAUTHORIZED);
            }
            const updatedTodo = await this.todoService.updateToDo(userId, id, title, description, completed);
            return { success: true, updatedTodo };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Unable to update todo', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteToDo(id, req) {
        try {
            const userId = req.user?.sub;
            if (!userId) {
                throw new common_1.HttpException('Invalid user', common_1.HttpStatus.UNAUTHORIZED);
            }
            await this.todoService.deleteToDo(userId, id);
            return { success: true, message: 'Todo deleted successfully' };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Unable to delete todo', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ToDoController = ToDoController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ToDoController.prototype, "getToDos", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ToDoController.prototype, "createToDo", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)('title')),
    __param(3, (0, common_1.Body)('description')),
    __param(4, (0, common_1.Body)('completed')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], ToDoController.prototype, "updateToDo", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ToDoController.prototype, "deleteToDo", null);
exports.ToDoController = ToDoController = __decorate([
    (0, common_1.Controller)('todos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [to_do_service_1.ToDoService])
], ToDoController);
//# sourceMappingURL=to-do.controller.js.map