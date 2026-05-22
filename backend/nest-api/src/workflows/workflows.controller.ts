import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('workflows')
export class WorkflowsController {
  constructor(private workflowsService: WorkflowsService) {}

  @Get('complaints')
  async getComplaints(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('severity') severity?: string,
    @Query('authorId') authorId?: string,
    @Query('assignedToId') assignedToId?: string,
    @Query('districtId') districtId?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.workflowsService.getComplaints({
      status,
      category,
      severity,
      authorId,
      assignedToId,
      districtId,
      limit,
      cursor,
    });
  }

  @Get('complaints/:id')
  async getComplaintById(@Param('id') id: string) {
    return this.workflowsService.getComplaintById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('complaints')
  async createComplaint(@Body() body: any, @Req() req: any) {
    const authorId = req.user.id;
    return this.workflowsService.createComplaint({ ...body, authorId });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STATE_ADMIN, Role.DISTRICT_ADMIN)
  @Post('complaints/assign')
  async assignComplaint(@Body() body: any, @Req() req: any) {
    const { complaintId, officerId } = body;
    return this.workflowsService.assignComplaint(complaintId, officerId, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OFFICER, Role.ADMIN)
  @Put('complaints/:id')
  async updateComplaint(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.workflowsService.updateComplaint(id, body, req.user);
  }
}
