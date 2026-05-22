import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('agents')
export class AgentsController {
  constructor(private agentsService: AgentsService) {}

  @Post('chat')
  async chat(@Body() body: any) {
    const { message, history } = body;
    return this.agentsService.chat(message, history || []);
  }

  @Post('classify')
  async classify(@Body() body: any) {
    return this.agentsService.classify(body.text);
  }

  @Post('duplicate-check')
  async checkDuplicate(@Body() body: any) {
    const { text, latitude, longitude } = body;
    return this.agentsService.checkDuplicate(text, latitude, longitude);
  }

  @Post('spam-check')
  async checkSpam(@Body() body: any) {
    return this.agentsService.checkSpam(body.text);
  }

  @Post('process-workflow')
  async processWorkflow(@Body() body: any) {
    const { complaintId, text, latitude, longitude } = body;
    return this.agentsService.processWorkflow(complaintId, text, latitude, longitude);
  }

  @UseGuards(JwtAuthGuard)
  @Post('assistant/chat')
  async assistantChat(@Body() body: any, @Req() req: any) {
    const { message, context } = body;
    const userId = req.user.id;
    const role = req.user.role;
    return this.agentsService.assistantChat(userId, message, role, context);
  }
}
