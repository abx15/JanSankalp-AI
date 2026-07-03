import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        overview: {
            totalUsers: number;
            totalAdmins: number;
            totalOfficers: number;
            totalCitizens: number;
            verifiedUsers: number;
            unverifiedUsers: number;
            totalComplaints: number;
            pendingComplaints: number;
            inProgressComplaints: number;
            resolvedComplaints: number;
            rejectedComplaints: number;
            recentLogins: number;
            newUsersThisMonth: number;
            activeUsersLast7Days: number;
        };
        departments: {
            id: string;
            name: string;
            complaintsCount: number;
            head: string;
        }[];
    }>;
    getAnalytics(req: any): Promise<{
        users: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.UserGroupByOutputType, "role"[]> & {
            _count: number;
        })[];
        statusDistribution: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ComplaintGroupByOutputType, "status"[]> & {
            _count: number;
        })[];
        categoryDistribution: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ComplaintGroupByOutputType, "category"[]> & {
            _count: number;
        })[];
        dailyTrends: {
            day: string;
            count: number;
        }[];
        severityDistribution: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ComplaintGroupByOutputType, "severity"[]> & {
            _count: number;
        })[];
        departmentActivity: {
            name: string;
            _count: {
                complaints: number;
            };
        }[];
        aiInsights: {
            hotspots: string[];
            summary: string;
            suggestions: string[];
        };
    }>;
    getAiStats(): Promise<{
        totalComplaints: number;
        aiProcessed: number;
        duplicates: number;
        spamRejected: number;
        autoRouted: number;
        averageConfidence: number;
        deptDistribution: {
            Roads: number;
            Water: number;
            Sanitation: number;
            Others: number;
        };
        severityStats: {
            Critical: number;
            High: number;
            Medium: number;
            Low: number;
        };
    }>;
    triggerAiProcess(): Promise<{
        message: string;
        results: any[];
    }>;
    getDepartments(): Promise<({
        _count: {
            complaints: number;
        };
        head: {
            name: string;
            id: string;
            email: string;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string | null;
        headId: string | null;
    })[]>;
    createDepartment(body: any): Promise<{
        _count: {
            complaints: number;
        };
        head: {
            name: string;
            id: string;
            email: string;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string | null;
        headId: string | null;
    }>;
    updateDepartment(id: string, body: any): Promise<{
        _count: {
            complaints: number;
        };
        head: {
            name: string;
            id: string;
            email: string;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string | null;
        headId: string | null;
    }>;
    deleteDepartment(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
