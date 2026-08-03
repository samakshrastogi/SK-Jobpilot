import * as React from 'react';
import { useResumesQuery } from '../hooks/use-resumes';
import { useNavigate, useLocation } from 'react-router-dom';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: resumesResponse, isLoading, isError } = useResumesQuery();

  const resumes = resumesResponse?.data || [];
  const masterResume = resumes.find(
    (r) => r.isMaster && r.parsingStatus === 'parsed' && r.rawText && r.rawText.trim().length > 0
  );

  React.useEffect(() => {
    if (!isLoading && !isError && !masterResume && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
    }
  }, [isLoading, isError, masterResume, location.pathname, navigate]);

  return <>{children}</>;
}
