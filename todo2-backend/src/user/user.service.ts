import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(firstName: string, lastName: string, email: string, password: string): Promise<User> {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({ firstName, lastName, email, password: hashedPassword });
    return this.userRepository.save(newUser);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Directly use the UUID for the user ID
  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } }); 
  }
}
