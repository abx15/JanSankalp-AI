export declare class AgentsService {
    private readonly aiBaseUrl;
    private readonly internalToken;
    private getHeaders;
    chat(message: string, history: any[]): Promise<any>;
    classify(text: string): Promise<any>;
    checkDuplicate(text: string, latitude: number, longitude: number): Promise<any>;
    checkSpam(text: string): Promise<any>;
    processWorkflow(complaintId: string, text: string, latitude: number, longitude: number): Promise<any>;
    assistantChat(userId: string, message: string, role: string, context?: any): Promise<any>;
}
