// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ToDo } from '../to-do/todo.entity'; // Import the ToDo entity

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  
  @OneToMany(() => ToDo, (todo) => todo.user)
  todos: ToDo[];  // This will hold the ToDo tasks for this user
}
