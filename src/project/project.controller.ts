import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { DeepPartial } from 'typeorm';

import { Roles, UserJWT } from '../@common/decorators';
import { RolesGuard } from '../@common/guards';
import { Project, ProjectDto } from '../@orm/project';
import { User } from '../@orm/user';
import { ACCESS_LEVEL } from '../@orm/user-project';
import { AccessLevel, ProjectParam } from './@common/decorators';
import { AccessLevelGuard } from './@common/guards';
import { ProjectPaginationDto } from './@dto';
import { ProjectService } from './project.service';

@ApiBearerAuth()
@ApiUseTags('projects')
@Controller('projects')
@UseGuards(AuthGuard('jwt'), RolesGuard, AccessLevelGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiResponse({ status: 200, type: Project, isArray: true })
  @Get()
  @Roles('user')
  public async allOwn(@UserJWT() user: User, @Query() pagesDto: ProjectPaginationDto): Promise<Partial<Project>[]> {
    return this.projectService.findWithPaginationByUser(pagesDto, user);
  }

  @ApiResponse({ status: 200, type: Project, isArray: true })
  @Get('all')
  @Roles('super-admin')
  public async all(@UserJWT() user: User, @Query() pagesDto: ProjectPaginationDto): Promise<Partial<Project>[]> {
    return this.projectService.findAllWithPagination(pagesDto, user);
  }

  @ApiResponse({ status: 200, type: Project })
  @Get(':projectId')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  public one(@UserJWT() user: User, @Param('projectId', ParseIntPipe) projectId: number): Promise<Partial<Project>> {
    return this.projectService.findOneByMember(projectId, user);
  }

  @ApiResponse({ description: 'Проект успешно создан', status: 201, type: Project })
  @Post()
  @Roles('user')
  public create(@UserJWT() user: User, @Body() data: ProjectDto): Promise<Project> {
    return this.projectService.create(data, user);
  }

  @ApiResponse({ description: 'Проект успешно удален. Возвращает id удаленного проекта', status: 200, type: Number })
  @Delete(':projectId')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.VIOLET)
  public delete(
    @Param('projectId', ParseIntPipe) projectId: number, // must be here because of swagger
    @ProjectParam() project: DeepPartial<Project> // DeepPartial must be here, because of type checking
  ): Promise<number> {
    return this.projectService.remove(project.id);
  }

  @ApiResponse({ description: 'Проект успешно удален. Возвращает id удаленного проекта', status: 200, type: Number })
  @Delete(':projectId/admin')
  @Roles('super-admin')
  public adminDelete(
    @Param('projectId', ParseIntPipe) projectId: number, // must be here because of swagger
    @ProjectParam() project: DeepPartial<Project> // DeepPartial must be here, because of type checking
  ): Promise<number> {
    return this.projectService.remove(project.id);
  }

  @ApiResponse({ description: 'Публикация проекта', status: 200, type: Project })
  @Post(':projectId/publish')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.VIOLET)
  public publish(
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: Project
  ): Promise<Project> {
    return this.projectService.publish(project);
  }

  @ApiResponse({ description: 'Обновить статистику по проекту', status: 200, type: Project })
  @Patch(':projectId/statistic')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.VIOLET)
  public async statistic(@ProjectParam() project: Project): Promise<Project> {
    return this.projectService.updateStatistic(project);
  }
}
