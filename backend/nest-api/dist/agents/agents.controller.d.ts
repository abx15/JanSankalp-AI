import { AgentsService } from './agents.service';
export declare class AgentsController {
    private agentsService;
    constructor(agentsService: AgentsService);
    chat(body: any): Promise<any>;
    classify(body: any): Promise<any>;
    checkDuplicate(body: any): Promise<any>;
    checkSpam(body: any): Promise<any>;
    processWorkflow(body: any): Promise<any>;
    assistantChat(body: any, req: any): Promise<any>;
}
