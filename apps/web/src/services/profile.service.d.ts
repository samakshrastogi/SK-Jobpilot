import type { ApiResponse, CandidateProfile } from '@sk-job-pilot/shared';
export declare function fetchProfile(): Promise<ApiResponse<CandidateProfile>>;
export declare function saveProfile(
  profileData: Partial<CandidateProfile>
): Promise<ApiResponse<CandidateProfile>>;
export declare function patchProfile(
  profileData: Partial<CandidateProfile>
): Promise<ApiResponse<CandidateProfile>>;
//# sourceMappingURL=profile.service.d.ts.map
