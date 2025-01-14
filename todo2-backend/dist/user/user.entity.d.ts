import { ToDo } from '../to-do/todo.entity';
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    todos: ToDo[];
}
