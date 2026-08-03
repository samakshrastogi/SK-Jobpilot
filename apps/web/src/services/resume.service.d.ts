import type { ApiResponse, PaginatedResponse, Resume } from '@sk-job-pilot/shared';
export declare function uploadResumeFile(file: File): Promise<ApiResponse<Resume>>;
export declare function fetchResumes(page?: number, limit?: number): Promise<PaginatedResponse<Resume>>;
export declare function deleteResume(id: string): Promise<ApiResponse<{
    id: string;
}>>;
export declare function setMasterResume(id: string): Promise<ApiResponse<Resume>>;
//# sourceMappingURL=resume.service.d.ts.map