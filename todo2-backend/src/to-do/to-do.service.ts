//todo service
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToDo } from './todo.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ToDoService {
  constructor(
    @InjectRepository(ToDo)
    private todoRepository: Repository<ToDo>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Fetch all ToDo tasks for a specific user
  async getToDos(userId: string): Promise<ToDo[]> {
    return await this.todoRepository.find({ where: { userId } });
  }

  // Create a new ToDo task
  async createToDo(
    userId: string,
    title: string,
    description: string,
  ): Promise<ToDo> {
    const newToDo = this.todoRepository.create({
      title,
      description,
      userId, // Associate the task with the userId from the token
    });

    return await this.todoRepository.save(newToDo);
  }

  // Update an existing ToDo task
  async updateToDo(
    userId: string,
    todoId: string,
    title?: string,
    description?: string,
    completed?: boolean,
  ): Promise<ToDo> {
    const todo = await this.todoRepository.findOne({ where: { id: todoId, userId } });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (title) todo.title = title;
    if (description) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    return await this.todoRepository.save(todo);
  }

  // Delete a ToDo task
  async deleteToDo(userId: string, todoId: string): Promise<void> {
    const todo = await this.todoRepository.findOne({ where: { id: todoId, userId } });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    await this.todoRepository.remove(todo);
  }
}
