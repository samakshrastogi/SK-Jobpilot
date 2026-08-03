import type { ApiResponse, PaginatedResponse, Application } from '@sk-job-pilot/shared';
export interface FetchApplicationsParams {
    page?: number;
    limit?: number;
    status?: string;
    jobId?: string;
}
export declare function fetchApplications(params?: FetchApplicationsParams): Promise<PaginatedResponse<Application>>;
export declare function createApplication(data: {
    jobId: string;
    resumeId?: string;
    status?: string;
    allowDuplicate?: boolean;
}): Promise<ApiResponse<Application>>;
export declare function updateApplication(id: string, data: Partial<Application>): Promise<ApiResponse<Application>>;
export declare function deleteApplication(id: string): Promise<ApiResponse<{
    id: string;
}>>;
export declare function addApplicationTimelineEvent(id: string, event: {
    status: string;
    title: string;
    description?: string;
    date?: string;
}): Promise<ApiResponse<Application>>;
//# sourceMappingURL=application.service.d.ts.map