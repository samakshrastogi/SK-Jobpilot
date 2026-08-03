import { type FetchApplicationsParams } from '../services/application.service';
import type { Application } from '@sk-job-pilot/shared';
export declare function useApplicationsQuery(
  params?: FetchApplicationsParams
): import('@tanstack/react-query').UseQueryResult<
  NoInfer<import('@sk-job-pilot/shared').PaginatedResponse<Application>>,
  Error
>;
export declare function useCreateApplicationMutation(): import('@tanstack/react-query').UseMutationResult<
  import('@sk-job-pilot/shared').ApiResponse<Application>,
  Error,
  {
    jobId: string;
    resumeId?: string;
    status?: string;
    allowDuplicate?: boolean;
  },
  unknown
>;
export declare function useUpdateApplicationMutation(): import('@tanstack/react-query').UseMutationResult<
  import('@sk-job-pilot/shared').ApiResponse<Application>,
  Error,
  {
    id: string;
    data: Partial<Application>;
  },
  unknown
>;
export declare function useDeleteApplicationMutation(): import('@tanstack/react-query').UseMutationResult<
  import('@sk-job-pilot/shared').ApiResponse<{
    id: string;
  }>,
  Error,
  string,
  unknown
>;
export declare function useAddTimelineEventMutation(): import('@tanstack/react-query').UseMutationResult<
  import('@sk-job-pilot/shared').ApiResponse<Application>,
  Error,
  {
    id: string;
    event: {
      status: string;
      title: string;
      description?: string;
      date?: string;
    };
  },
  unknown
>;
//# sourceMappingURL=use-applications.d.ts.map
