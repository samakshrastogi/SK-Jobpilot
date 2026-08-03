import type { ApiResponse, PaginatedResponse, Job } from '@sk-job-pilot/shared';
export interface FetchJobsParams {
    page?: number;
    limit?: number;
    search?: string;
    workMode?: string;
    employmentType?: string;
    savedOnly?: boolean;
    archivedOnly?: boolean;
}
export declare function fetchJobs(params?: FetchJobsParams): Promise<PaginatedResponse<Job>>;
export declare function createJob(jobData: Partial<Job>): Promise<ApiResponse<Job>>;
export declare function toggleSaveJob(id: string): Promise<ApiResponse<Job>>;
export declare function toggleArchiveJob(id: string): Promise<ApiResponse<Job>>;
export declare function deleteJob(id: string): Promise<ApiResponse<{
    id: string;
}>>;
//# sourceMappingURL=job.service.d.ts.map