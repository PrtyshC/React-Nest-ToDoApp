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
exports.ToDoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const todo_entity_1 = require("./todo.entity");
const user_entity_1 = require("../user/user.entity");
let ToDoService = class ToDoService {
    constructor(todoRepository, userRepository) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }
    async getToDos(userId) {
        return await this.todoRepository.find({ where: { userId } });
    }
    async createToDo(userId, title, description) {
        const newToDo = this.todoRepository.create({
            title,
            description,
            userId,
        });
        return await this.todoRepository.save(newToDo);
    }
    async updateToDo(userId, todoId, title, description, completed) {
        const todo = await this.todoRepository.findOne({ where: { id: todoId, userId } });
        if (!todo) {
            throw new common_1.NotFoundException('Todo not found');
        }
        if (title)
            todo.title = title;
        if (description)
            todo.description = description;
        if (completed !== undefined)
            todo.completed = completed;
        return await this.todoRepository.save(todo);
    }
    async deleteToDo(userId, todoId) {
        const todo = await this.todoRepository.findOne({ where: { id: todoId, userId } });
        if (!todo) {
            throw new common_1.NotFoundException('Todo not found');
        }
        await this.todoRepository.remove(todo);
    }
};
exports.ToDoService = ToDoService;
exports.ToDoService = ToDoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(todo_entity_1.ToDo)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ToDoService);
//# sourceMappingURL=to-do.service.js.map