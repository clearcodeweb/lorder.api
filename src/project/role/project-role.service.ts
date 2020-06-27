import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { classToClass } from 'class-transformer';
import { In } from 'typeorm';

import { Project } from '@orm/project';
import { User } from '@orm/user';

import { ROLE } from '../../@domains/strategy';
import { ProjectRoleAllowedMove } from '../../@orm/project-role-allowed-move/project-role-allowed-move.entity';
import { ProjectRole } from '../../@orm/project-role/project-role.entity';
import { RoleService } from '../../role/role.service';
import { ProjectRoleCreateDto } from './dto';
import { ProjectRoleRepository } from './project-role.repository';

@Injectable()
export class ProjectRoleService {
  constructor(
    @InjectRepository(ProjectRoleRepository) private readonly repo: ProjectRoleRepository,
    private readonly roleService: RoleService
  ) {}

  public async findAll(project: Project): Promise<ProjectRole[]> {
    return await this.repo.find({
      where: { project: { id: project.id } },
      relations: ['role'],
      loadRelationIds: {
        relations: ['project'],
      },
    });
  }

  public async createOne(projectRoleDto: ProjectRoleCreateDto, project: Project, user: User): Promise<ProjectRole> {
    const role = await this.roleService.getOneById(projectRoleDto.roleId);
    if (!role) {
      throw new NotFoundException('Role Was not found');
    }
    const projectRoleData: Partial<ProjectRole> = {
      project,
      role,
      allowedMoves: projectRoleDto.allowedMoveIds.map((id) => ({ id })) as ProjectRoleAllowedMove[],
    };
    const entity = this.repo.create(projectRoleData);
    return classToClass(await this.repo.save(entity));
  }

  public async deleteOne(project: Project, user: User, roleId: ROLE) {
    return this.repo.delete({
      project,
      role: { id: roleId },
    });
  }

  public async findByRoles(roles: string[], project: Project): Promise<ProjectRole[]> {
    return await this.repo.find({
      where: { project: { id: project.id }, role: { id: In(roles) } },
      relations: ['role'],
      loadRelationIds: {
        relations: ['project'],
      },
    });
  }
}
