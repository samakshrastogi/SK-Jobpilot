import { type FetchJobsParams } from '../services/job.service';
import type { Job } from '@sk-job-pilot/shared';
export declare function useJobsQuery(params?: FetchJobsParams): import("@tanstack/react-query").UseQueryResult<NoInfer<import("@sk-job-pilot/shared").PaginatedResponse<Job>>, Error>;
export declare function useCreateJobMutation(): import("@tanstack/react-query").UseMutationResult<import("@sk-job-pilot/shared").ApiResponse<Job>, Error, Partial<Job>, unknown>;
export declare function useToggleSaveJobMutation(): import("@tanstack/react-query").UseMutationResult<import("@sk-job-pilot/shared").ApiResponse<Job>, Error, string, unknown>;
export declare function useToggleArchiveJobMutation(): import("@tanstack/react-query").UseMutationResult<import("@sk-job-pilot/shared").ApiResponse<Job>, Error, string, unknown>;
export declare function useDeleteJobMutation(): import("@tanstack/react-query").UseMutationResult<import("@sk-job-pilot/shared").ApiResponse<{
    id: string;
}>, Error, string, unknown>;
//# sourceMappingURL=use-jobs.d.ts.map