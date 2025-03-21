import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    createUser(firstName: string, lastName: string, email: string, password: string): Promise<User>;
    findByEmail(email: string): Promise<User | undefined>;
    findUserByEmail(email: string): Promise<User>;
    findById(id: string): Promise<User>;
}
