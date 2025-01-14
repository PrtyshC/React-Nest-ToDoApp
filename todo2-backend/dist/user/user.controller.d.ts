import { UserService } from './user.service';
import { User } from './user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }): Promise<User>;
    findUserByEmail(body: {
        email: string;
    }): Promise<User>;
    getUser(req: any): Promise<User>;
}
