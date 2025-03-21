//todo controller
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ToDoService } from './to-do.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';

@Controller('todos')
@UseGuards(JwtAuthGuard) // Apply JWT guard to all routes
export class ToDoController {
  constructor(private readonly todoService: ToDoService) {}

  @Get()
  async getToDos(@Request() req) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new HttpException('Invalid user', HttpStatus.UNAUTHORIZED);
      }

      const todos = await this.todoService.getToDos(userId);
      return { success: true, todos };
    } catch (error) {
      throw new HttpException(error.message || 'Unable to fetch todos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createToDo(
    @Request() req,
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new HttpException('Invalid user', HttpStatus.UNAUTHORIZED);
      }

      const todo = await this.todoService.createToDo(userId, title, description);
      return { success: true, todo };
    } catch (error) {
      throw new HttpException(error.message || 'Unable to create todo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updateToDo(
    @Param('id') id: string,
    @Request() req,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('completed') completed: boolean,
  ) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new HttpException('Invalid user', HttpStatus.UNAUTHORIZED);
      }

      const updatedTodo = await this.todoService.updateToDo(userId, id, title, description, completed);
      return { success: true, updatedTodo };
    } catch (error) {
      throw new HttpException(error.message || 'Unable to update todo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteToDo(@Param('id') id: string, @Request() req) {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        throw new HttpException('Invalid user', HttpStatus.UNAUTHORIZED);
      }
      await this.todoService.deleteToDo(userId, id);
      return { success: true, message: 'Todo deleted successfully'};
    } catch (error) {
      throw new HttpException(error.message || 'Unable to delete todo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
