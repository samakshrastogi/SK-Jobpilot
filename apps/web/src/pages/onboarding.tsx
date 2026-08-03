import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Upload, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useUploadResumeMutation } from '../hooks/use-resumes';
import { useProfileQuery } from '../hooks/use-profile';
import { useHealthQuery } from '../hooks/use-health';
import { patchProfile } from '../services/profile.service';
import {
  fetchOnboardingState,
  generateRoleRecommendations,
  runDiscoveryNow,
  selectTargetRoles,
  updateAutomationConfiguration,
  updateOnboardingStep,
  type RoleRecommendation,
} from '../services/onboarding.service';
import type { Resume } from '@sk-job-pilot/shared';

const STEPS = [
  'Upload', 'Verify Evidence', 'Target Roles', 'Preferences', 'Screening Safety', 'Activate Automation',
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadResumeMutation();
  const profileQuery = useProfileQuery();
  const healthQuery = useHealthQuery();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [resume, setResume] = React.useState<Resume | null>(null);
  const [recommendations, setRecommendations] = React.useState<RoleRecommendation[]>([]);
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);
  const [isGeneratingRoles, setIsGeneratingRoles] = React.useState(false);
  const [isActivating, setIsActivating] = React.useState(false);
  const [preferredLocations, setPreferredLocations] = React.useState('Gurugram, Noida, Bengaluru, Hyderabad, Pune, Remote India');
  const [minimumMatchScore, setMinimumMatchScore] = React.useState(75);
  const [dailyTarget, setDailyTarget] = React.useState(10);

  React.useEffect(() => {
    void fetchOnboardingState().then((response) => {
      if (response.data?.step) setCurrentStep(response.data.step);
    }).catch(() => undefined);
  }, []);

  const goToStep = async (step: number) => {
    setCurrentStep(step);
    try {
      await updateOnboardingStep(step);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save onboarding progress');
    }
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const response = await uploadMutation.mutateAsync(file);
      if (!response.data) throw new Error('Resume processing returned no data');
      setResume(response.data);
      await profileQuery.refetch();
      if (response.data.parsingStatus === 'requires_ocr') {
        toast.warning('Resume needs OCR. Upload a text-based PDF or DOCX for reliable matching.');
        return;
      }
      if (response.data.parsingStatus !== 'parsed') throw new Error('Resume text could not be parsed');
      toast.success('Resume parsed and candidate profile updated');
      await goToStep(2);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Resume upload failed');
    } finally {
      event.target.value = '';
    }
  };

  const handleConfirmEvidence = async () => {
    setIsGeneratingRoles(true);
    try {
      const response = await generateRoleRecommendations();
      const roles = response.data || [];
      if (roles.length === 0) throw new Error('No evidence-based roles could be generated');
      setRecommendations(roles);
      setSelectedRoles(roles.filter((role) => role.applicationRecommendation !== 'not_recommended').slice(0, 3).map((role) => role.roleTitle));
      await goToStep(3);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Role recommendation failed');
    } finally {
      setIsGeneratingRoles(false);
    }
  };

  const handleRoleSelection = async () => {
    if (selectedRoles.length === 0) return toast.error('Select at least one target role');
    try {
      await selectTargetRoles(selectedRoles);
      toast.success(`${selectedRoles.length} target roles saved`);
      await goToStep(4);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save target roles');
    }
  };

  const handleSavePreferences = async () => {
    const locations = preferredLocations.split(',').map((value) => value.trim()).filter(Boolean);
    try {
      await patchProfile({
        professionalInfo: { preferredLocations: locations, remotePreference: 'open', employmentTypes: ['Full-time'] },
        jobPreferences: {
          targetTitles: selectedRoles,
          preferredWorkModes: ['remote', 'hybrid', 'onsite'],
          minExperienceYears: 0,
          maxExperienceYears: 3,
          excludedKeywords: ['Internship', 'Senior', 'Lead', 'Staff', 'Principal', 'Architect', 'Manager'],
          relocationCountries: ['India'],
        },
      });
      await goToStep(5);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save job preferences');
    }
  };

  const handleActivate = async () => {
    const safeDailyTarget = Math.min(50, Math.max(1, Number.isFinite(dailyTarget) ? dailyTarget : 10));
    const safeMinimumMatchScore = Math.min(100, Math.max(0, Number.isFinite(minimumMatchScore) ? minimumMatchScore : 75));
    setIsActivating(true);
    try {
      await updateAutomationConfiguration({
        enabled: true,
        mode: 'prepare_and_review',
        frequency: 'hourly',
        minimumMatchScore: safeMinimumMatchScore,
        maxApplicationsPerHour: Math.min(5, safeDailyTarget),
        maxApplicationsPerDay: safeDailyTarget,
        autoAnalyze: true,
        autoMatch: true,
        autoTailorResume: true,
        autoGenerateCoverLetter: true,
        autoSubmitSafeApplications: false,
      });
      await updateOnboardingStep(6);
      const run = await runDiscoveryNow();
      const detail = run.data?.summary || 'Agent workflow is ready.';
      toast.success(`Automation activated. ${detail || 'Discovery is ready.'}`);
      navigate('/automation');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Automation activation failed');
    } finally {
      setIsActivating(false);
    }
  };

  const isDatabaseConnected = healthQuery.data?.data?.database === 'connected';
  const parsed = resume?.parsedContent;
  const profile = profileQuery.data?.data;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader title="Candidate Onboarding Wizard" description="Upload real resume evidence, choose multiple target roles, and activate safe job discovery and application preparation." />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 border-b border-slate-800 pb-4">
        {STEPS.map((label, index) => {
          const step = index + 1;
          return <button key={label} type="button" disabled={step > currentStep} onClick={() => void goToStep(step)} className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-semibold border ${currentStep === step ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : currentStep > step ? 'bg-slate-900 border-slate-800 text-emerald-400' : 'bg-slate-950/40 border-slate-900 text-slate-500'}`}><span className="text-[10px]">STEP {step}</span><span>{label}</span></button>;
        })}
      </div>

      {!healthQuery.isLoading && !isDatabaseConnected && <div className="flex gap-3 rounded-lg border border-amber-500/40 bg-amber-950/20 p-4 text-sm text-amber-200"><AlertTriangle className="h-5 w-5 shrink-0" /><div><strong>MongoDB is not connected.</strong><p className="text-xs mt-1">Start Docker Desktop, run <code>docker compose up -d mongodb</code>, and wait a few seconds. Upload and profile actions are disabled until the database reconnects.</p></div></div>}

      {currentStep === 1 && <Card className="p-8 border-dashed border-indigo-500/40 bg-slate-900/60 text-center space-y-4">
        <Upload className="h-10 w-10 mx-auto text-indigo-400" />
        <div><h3 className="text-lg font-bold text-slate-100">Upload Your Master Resume</h3><p className="text-xs text-slate-400 mt-1">PDF or DOCX, up to the configured upload limit. The backend extracts actual text and never invents missing facts.</p></div>
        <input ref={fileInputRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(event) => void handleFile(event)} />
        <Button variant="primary" disabled={uploadMutation.isPending || !isDatabaseConnected} onClick={() => fileInputRef.current?.click()}>{uploadMutation.isPending ? 'Uploading and parsing…' : 'Select PDF/DOCX Resume'}</Button>
      </Card>}

      {currentStep === 2 && <Card className="p-6 border-slate-800 bg-slate-900/60 space-y-4">
        <div className="flex items-center justify-between"><h3 className="font-bold text-slate-100">Verify extracted resume evidence</h3><Badge variant={resume?.parsingStatus === 'parsed' ? 'success' : 'warning'}>{resume?.parsingStatus || 'Loaded profile'}</Badge></div>
        <div className="grid md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded bg-slate-950 border border-slate-800"><span className="text-slate-400 block mb-2">Contact</span><p>{parsed?.contactInfo?.email || profile?.personalInfo.email || 'Email missing — add it in Settings'}</p><p>{parsed?.contactInfo?.phone || profile?.personalInfo.phone || 'Phone missing — add it in Settings'}</p></div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800"><span className="text-slate-400 block mb-2">Parsing confidence</span><p className="text-lg font-bold">{resume?.parsingConfidence ?? 0}%</p><p>{resume?.warnings?.join(' · ') || 'No parser warnings'}</p></div>
        </div>
        <div className="flex flex-wrap gap-2">{(parsed?.skills || Object.values(profile?.skills || {}).flat()).map((skill) => <Badge key={skill} variant="outline">{skill}</Badge>)}</div>
        <div className="flex justify-end"><Button variant="primary" disabled={isGeneratingRoles} onClick={() => void handleConfirmEvidence()}>{isGeneratingRoles ? 'Analyzing evidence…' : 'Evidence is correct — suggest roles'} <ArrowRight className="h-4 w-4 ml-2" /></Button></div>
      </Card>}

      {currentStep === 3 && <Card className="p-6 border-slate-800 bg-slate-900/60 space-y-4">
        <h3 className="font-bold text-slate-100 flex items-center gap-2"><Sparkles className="h-4 w-4 text-indigo-400" /> Resume-based target roles</h3>
        <p className="text-xs text-slate-400">Choose one or more roles. Scores are evidence-based suitability estimates, not hiring probabilities.</p>
        <div className="grid md:grid-cols-2 gap-3">{recommendations.map((role) => { const selected = selectedRoles.includes(role.roleTitle); return <button type="button" key={role.roleTitle} onClick={() => setSelectedRoles((items) => selected ? items.filter((item) => item !== role.roleTitle) : [...items, role.roleTitle])} className={`text-left p-4 rounded-lg border ${selected ? 'bg-indigo-600/15 border-indigo-500/50' : 'bg-slate-950 border-slate-800'}`}><div className="flex justify-between gap-2"><span className="font-bold text-sm">{role.roleTitle}</span><Badge variant="success">{role.suitabilityScore}% fit</Badge></div><p className="text-xs text-slate-400 mt-2">{role.evidence.join(' · ')}</p><div className="flex flex-wrap gap-1 mt-2">{role.matchingSkills.map((skill) => <span key={skill} className="text-[10px] px-1.5 py-0.5 bg-slate-900 rounded">{skill}</span>)}</div></button>; })}</div>
        <div className="flex justify-end"><Button variant="primary" onClick={() => void handleRoleSelection()}>Save {selectedRoles.length} roles <ArrowRight className="h-4 w-4 ml-2" /></Button></div>
      </Card>}

      {currentStep === 4 && <Card className="p-6 border-slate-800 bg-slate-900/60 space-y-4">
        <h3 className="font-bold text-slate-100">Application targeting preferences</h3>
        <label className="block text-xs text-slate-400">Preferred locations<input value={preferredLocations} onChange={(event) => setPreferredLocations(event.target.value)} className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2 text-slate-100" /></label>
        <div className="grid grid-cols-2 gap-3"><label className="text-xs text-slate-400">Minimum match score<input type="number" min="50" max="100" value={minimumMatchScore} onChange={(event) => setMinimumMatchScore(Math.min(100, Math.max(0, Number(event.target.value))))} className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2" /></label><label className="text-xs text-slate-400">Daily preparation target<input type="number" min="1" max="50" value={dailyTarget} onChange={(event) => setDailyTarget(Math.min(50, Math.max(1, Number(event.target.value))))} className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2" /></label></div>
        <div className="flex justify-end"><Button variant="primary" onClick={() => void handleSavePreferences()}>Save preferences <ArrowRight className="h-4 w-4 ml-2" /></Button></div>
      </Card>}

      {currentStep === 5 && <Card className="p-6 border-slate-800 bg-slate-900/60 space-y-4">
        <h3 className="font-bold text-slate-100">Screening-answer safety</h3>
        <div className="flex gap-3 p-3 rounded bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200"><AlertTriangle className="h-5 w-5 shrink-0" /><p>Unknown answers are never invented. Salary, sponsorship, work authorization, demographic, disability, criminal-history, and legal declarations always require your saved answer and review.</p></div>
        <p className="text-xs text-slate-400">Add reusable answers from Applications after onboarding. Jobs with missing or sensitive answers remain in Review Queue.</p>
        <div className="flex justify-end"><Button variant="primary" onClick={() => void goToStep(6)}>I understand — continue <ArrowRight className="h-4 w-4 ml-2" /></Button></div>
      </Card>}

      {currentStep === 6 && <Card className="p-8 border-emerald-500/40 bg-slate-900/60 text-center space-y-4">
        <ShieldCheck className="h-10 w-10 mx-auto text-emerald-400" /><h3 className="text-lg font-bold">Ready for safe automation</h3><p className="text-xs text-slate-400">Public ATS sources run automatically. LinkedIn, Wellfound, Naukri, and authenticated platforms require the browser extension and your explicit action. JobPilot prepares and autofills; you review and submit.</p>
        <Button size="lg" variant="primary" disabled={isActivating} onClick={() => void handleActivate()}><CheckCircle2 className="h-5 w-5 mr-2" />{isActivating ? 'Activating…' : 'Activate & run discovery now'}</Button>
      </Card>}
    </div>
  );
}