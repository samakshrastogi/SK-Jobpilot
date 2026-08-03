export declare function useResumesQuery(page?: number, limit?: number): import("@tanstack/react-query").UseQueryResult<NoInfer<import("@sk-job-pilot/shared").PaginatedResponse<import("@sk-job-pilot/shared").Resume>>, Error>;
export declare function useUploadResumeMutation(): import("@tanstack/react-query").UseMutationResult<import("@sk-job-pilot/shared").ApiResponse<import("@sk-job-pilot/shared").Resume>, Error, File, unknown>;
export declare function useDeleteResumeMutation(): import("@tanstack/react-query").UseMutationResult<import("@sk-job-pilot/shared").ApiResponse<{
    id: string;
}>, Error, string, unknown>;
export declare function useSetMasterResumeMutation(): import("@tanstack/react-query").UseMutationResult<import("@sk-job-pilot/shared").ApiResponse<import("@sk-job-pilot/shared").Resume>, Error, string, unknown>;
//# sourceMappingURL=use-resumes.d.ts.map