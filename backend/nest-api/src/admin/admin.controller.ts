import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Roles(Role.ADMIN)
  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Roles(Role.ADMIN, Role.STATE_ADMIN, Role.DISTRICT_ADMIN, Role.CITY_ADMIN)
  @Get('analytics')
  async getAnalytics(@Req() req: any) {
    return this.adminService.getAnalytics(req.user);
  }

  @Roles(Role.ADMIN)
  @Get('ai-stats')
  async getAiStats() {
    return this.adminService.getAiStats();
  }

  @Roles(Role.ADMIN)
  @Post('ai-process')
  async triggerAiProcess() {
    return this.adminService.triggerAiProcess();
  }

  @Get('departments')
  async getDepartments() {
    return this.adminService.getDepartments();
  }

  @Roles(Role.ADMIN)
  @Post('departments')
  async createDepartment(@Body() body: any) {
    return this.adminService.createDepartment(body);
  }

  @Roles(Role.ADMIN)
  @Put('departments/:id')
  async updateDepartment(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateDepartment(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete('departments/:id')
  async deleteDepartment(@Param('id') id: string) {
    return this.adminService.deleteDepartment(id);
  }
}
