import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Upload, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>(['Backend Engineer', 'Full Stack Engineer']);

  const sampleRecommendedRoles = [
    { title: 'Backend Engineer', match: 94, skills: ['Node.js', 'Python', 'TypeScript', 'MongoDB'] },
    { title: 'Full Stack Engineer', match: 89, skills: ['React', 'Node.js', 'TypeScript', 'Tailwind'] },
    { title: 'AI Engineer', match: 84, skills: ['Gemini API', 'Python', 'Vector Databases'] },
    { title: 'Node.js Developer', match: 91, skills: ['Node.js', 'Express', 'TypeScript', 'REST API'] },
  ];

  const toggleRole = (title: string) => {
    setSelectedRoles((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleFinishOnboarding = () => {
    toast.success('Onboarding completed! Hourly discovery automation activated.');
    navigate('/automation');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Candidate Onboarding Wizard"
        description="Resume-first setup: Upload your resume, verify candidate evidence, select target roles, and activate automated job discovery."
      />

      {/* Step Indicator */}
      <div className="grid grid-cols-6 gap-2 border-b border-slate-800 pb-4">
        {[
          { num: 1, label: 'Upload' },
          { num: 2, label: 'Verify Evidence' },
          { num: 3, label: 'Target Roles' },
          { num: 4, label: 'Preferences' },
          { num: 5, label: 'Screening Answers' },
          { num: 6, label: 'Activate Automation' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setCurrentStep(s.num)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-semibold border transition-all ${
              currentStep === s.num
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                : currentStep > s.num
                ? 'bg-slate-900 border-slate-800 text-emerald-400'
                : 'bg-slate-950/40 border-slate-900 text-slate-500'
            }`}
          >
            <span className="text-[10px] font-bold">STEP {s.num}</span>
            <span className="truncate">{s.label}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: Upload Master Resume */}
      {currentStep === 1 && (
        <Card className="p-8 border-dashed border-indigo-500/40 bg-slate-900/60 text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-indigo-600/20 text-indigo-400">
              <Upload className="h-8 w-8" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Upload Your Master Resume</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Upload your primary PDF or DOCX resume. SK JobPilot will extract your skills, experience, and projects without fabricating information.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="primary"
              onClick={() => {
                setIsUploading(true);
                setTimeout(() => {
                  setIsUploading(false);
                  toast.success('Master resume uploaded and parsed successfully!');
                  setCurrentStep(2);
                }, 1000);
              }}
              disabled={isUploading}
            >
              {isUploading ? 'Extracting Resume...' : 'Select PDF/DOCX Resume'}
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Verify Evidence */}
      {currentStep === 2 && (
        <Card className="p-6 border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Extracted Candidate Profile Evidence
              </h3>
              <p className="text-xs text-slate-400">Verify extracted skills and experience before activating automation.</p>
            </div>
            <Badge variant="success">Confidence 96%</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400 font-bold block mb-1">Primary Skills Extracted:</span>
              <div className="flex flex-wrap gap-1.5">
                {['TypeScript', 'Node.js', 'React', 'Python', 'MongoDB', 'REST API', 'Express'].map((sk) => (
                  <Badge key={sk} variant="outline" className="text-indigo-300">
                    {sk}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="primary" onClick={() => setCurrentStep(3)}>
              Confirm & Continue <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Target Role Recommendations */}
      {currentStep === 3 && (
        <Card className="p-6 border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" /> Evidence-Based Qualified Roles
              </h3>
              <p className="text-xs text-slate-400">Select target roles for hourly automated job discovery.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sampleRecommendedRoles.map((role) => {
              const isSelected = selectedRoles.includes(role.title);
              return (
                <div
                  key={role.title}
                  onClick={() => toggleRole(role.title)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500/50 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-100">{role.title}</span>
                    <Badge variant="success">{role.match}% Qualification</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {role.skills.map((s) => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="primary" onClick={() => setCurrentStep(4)}>
              Confirm Target Roles ({selectedRoles.length}) <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4 & 5: Preferences & Answers */}
      {(currentStep === 4 || currentStep === 5) && (
        <Card className="p-6 border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            {currentStep === 4 ? 'Job Preferences & Salary Thresholds' : 'Saved Application Answers & Safety Policy'}
          </h3>
          <p className="text-xs text-slate-400">
            Configure preferred work modes (Remote/Hybrid), salary thresholds, and sensitive answer confirmations.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="primary" onClick={() => setCurrentStep(currentStep + 1)}>
              Continue <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 6: Activate Automation */}
      {currentStep === 6 && (
        <Card className="p-8 border-emerald-500/40 bg-slate-900/60 text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-emerald-600/20 text-emerald-400">
              <ShieldCheck className="h-8 w-8" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Ready to Activate Hourly Discovery Automation</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              SK JobPilot will perform hourly discovery over your selected target roles. Applications requiring sensitive confirmation or legal declarations will route to the Review Queue.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="primary" size="lg" onClick={handleFinishOnboarding}>
              <CheckCircle2 className="h-5 w-5 mr-2" /> Activate Hourly Automation
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
