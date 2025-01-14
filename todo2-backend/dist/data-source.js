"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user/user.entity");
const todo_entity_1 = require("./to-do/todo.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'data.db',
    synchronize: false,
    logging: true,
    entities: [user_entity_1.User, todo_entity_1.ToDo],
    migrations: ['src/migrations/*.ts'],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map