import { ToDoService } from './to-do.service';
export declare class ToDoController {
    private readonly todoService;
    constructor(todoService: ToDoService);
    getToDos(req: any): Promise<{
        success: boolean;
        todos: import("./todo.entity").ToDo[];
    }>;
    createToDo(req: any, title: string, description: string): Promise<{
        success: boolean;
        todo: import("./todo.entity").ToDo;
    }>;
    updateToDo(id: string, req: any, title: string, description: string, completed: boolean): Promise<{
        success: boolean;
        updatedTodo: import("./todo.entity").ToDo;
    }>;
    deleteToDo(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
