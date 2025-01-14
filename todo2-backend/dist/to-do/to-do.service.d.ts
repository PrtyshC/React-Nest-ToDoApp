import { Repository } from 'typeorm';
import { ToDo } from './todo.entity';
import { User } from '../user/user.entity';
export declare class ToDoService {
    private todoRepository;
    private userRepository;
    constructor(todoRepository: Repository<ToDo>, userRepository: Repository<User>);
    getToDos(userId: string): Promise<ToDo[]>;
    createToDo(userId: string, title: string, description: string): Promise<ToDo>;
    updateToDo(userId: string, todoId: string, title?: string, description?: string, completed?: boolean): Promise<ToDo>;
    deleteToDo(userId: string, todoId: string): Promise<void>;
}
