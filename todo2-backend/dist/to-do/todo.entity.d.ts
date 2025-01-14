import { User } from '../user/user.entity';
export declare class ToDo {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    user: User;
    userId: string;
}
