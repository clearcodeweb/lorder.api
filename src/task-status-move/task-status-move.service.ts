import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { TaskStatusMove } from './task-status-move.entity';

@Injectable()
export class TaskStatusMoveService extends TypeOrmCrudService<TaskStatusMove> {
  constructor(@InjectRepository(TaskStatusMove) repo) {
    super(repo);
  }
}