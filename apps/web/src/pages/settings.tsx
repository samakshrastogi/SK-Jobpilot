import * as React from 'react';
import {
  Save,
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Wrench,
  SlidersHorizontal,
  Plus,
  Trash2,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { LoadingState } from '../components/ui/loading-state';
import { ErrorState } from '../components/ui/error-state';
import { useProfileQuery, useSaveProfileMutation } from '../hooks/use-profile';
import { useDatabaseHealthQuery } from '../hooks/use-health';
import { useAIHealthQuery } from '../hooks/use-ai';
import type { CandidateProfile } from '@sk-job-pilot/shared';
import { toast } from 'sonner';

export function SettingsPage() {
  const { data: profileResponse, isLoading, isError, refetch } = useProfileQuery();
  const { data: dbData } = useDatabaseHealthQuery();
  const { data: aiHealthResponse } = useAIHealthQuery();
  const saveMutation = useSaveProfileMutation();

  const [activeTab, setActiveTab] = React.useState<
    | 'personal'
    | 'professional'
    | 'skills'
    | 'experience'
    | 'education'
    | 'projects'
    | 'certificates'
    | 'preferences'
    | 'ai'
  >('personal');

  const [formData, setFormData] = React.useState<Partial<CandidateProfile>>({});

  React.useEffect(() => {
    if (profileResponse?.data) {
      setFormData(profileResponse.data);
    }
  }, [profileResponse]);

  if (isLoading) return <LoadingState message="Loading candidate profile..." />;
  if (isError) return <ErrorState title="Failed to load profile" onRetry={refetch} />;

  const handleSave = () => {
    saveMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Candidate profile saved successfully!');
      },
      onError: (err: unknown) => {
        toast.error(err instanceof Error ? err.message : 'Failed to save candidate profile');
      },
    });
  };

  const updatePersonalInfo = (field: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...(prev.personalInfo || { fullName: '', email: '' }), [field]: val },
    }));
  };

  const updateProfessionalInfo = (field: string, val: unknown) => {
    setFormData((prev) => ({
      ...prev,
      professionalInfo: { ...(prev.professionalInfo || {}), [field]: val },
    }));
  };

  const updateSkills = (category: string, csv: string) => {
    const arr = csv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      skills: { ...(prev.skills || {}), [category]: arr },
    }));
  };

  const aiHealth = aiHealthResponse?.data;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Candidate Profile & AI Settings"
        description="Single-owner master candidate profile & AI engine configurations."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Profile & Settings' }]}
        actions={
          <Button size="sm" onClick={handleSave} isLoading={saveMutation.isPending}>
            <Save className="h-4 w-4 mr-1.5" />
            Save Profile
          </Button>
        }
      />

      {/* Tabs Navigation Bar */}
      <div className="flex overflow-x-auto border-b border-slate-800 gap-1 pb-1">
        {[
          { id: 'personal', label: 'Personal Info', icon: User },
          { id: 'professional', label: 'Professional Info', icon: Briefcase },
          { id: 'skills', label: 'Skills', icon: Wrench },
          { id: 'experience', label: 'Experience', icon: Briefcase },
          { id: 'education', label: 'Education', icon: GraduationCap },
          { id: 'projects', label: 'Projects', icon: FolderGit2 },
          { id: 'certificates', label: 'Certificates', icon: Award },
          { id: 'preferences', label: 'Job Preferences', icon: SlidersHorizontal },
          { id: 'ai', label: 'AI Intelligence Settings', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Personal Info */}
      {activeTab === 'personal' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Contact Information</CardTitle>
            <CardDescription>Primary contact details rendered on tailored resumes.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.personalInfo?.fullName || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updatePersonalInfo('fullName', e.target.value)
              }
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.personalInfo?.email || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updatePersonalInfo('email', e.target.value)
              }
            />
            <Input
              label="Phone Number"
              value={formData.personalInfo?.phone || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updatePersonalInfo('phone', e.target.value)
              }
            />
            <Input
              label="Current Location"
              value={formData.personalInfo?.location || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updatePersonalInfo('location', e.target.value)
              }
            />
            <Input
              label="LinkedIn Profile URL"
              value={formData.personalInfo?.linkedinUrl || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updatePersonalInfo('linkedinUrl', e.target.value)
              }
            />
            <Input
              label="GitHub Profile URL"
              value={formData.personalInfo?.githubUrl || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updatePersonalInfo('githubUrl', e.target.value)
              }
            />
            <Input
              label="Portfolio Website URL"
              value={formData.personalInfo?.portfolioUrl || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updatePersonalInfo('portfolioUrl', e.target.value)
              }
            />
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Professional Info */}
      {activeTab === 'professional' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Professional Overview</CardTitle>
            <CardDescription>
              Target title, executive summary, and availability parameters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Current Professional Title"
              value={formData.professionalInfo?.currentTitle || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateProfessionalInfo('currentTitle', e.target.value)
              }
            />
            <Textarea
              label="Professional Summary"
              rows={4}
              value={formData.professionalInfo?.summary || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateProfessionalInfo('summary', e.target.value)
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Total Experience (Months)"
                type="number"
                value={formData.professionalInfo?.totalExperienceMonths || 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateProfessionalInfo('totalExperienceMonths', parseInt(e.target.value) || 0)
                }
              />
              <Select
                label="Remote Work Preference"
                value={formData.professionalInfo?.remotePreference || 'open'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  updateProfessionalInfo('remotePreference', e.target.value)
                }
                options={[
                  { value: 'open', label: 'Open to All' },
                  { value: 'remote_only', label: 'Remote Only' },
                  { value: 'hybrid', label: 'Hybrid' },
                  { value: 'onsite', label: 'Onsite Only' },
                ]}
              />
              <Input
                label="Notice Period (Days)"
                type="number"
                value={formData.professionalInfo?.noticePeriodDays || 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateProfessionalInfo('noticePeriodDays', parseInt(e.target.value) || 0)
                }
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Skills */}
      {activeTab === 'skills' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skills & Technical Competencies</CardTitle>
            <CardDescription>Comma-separated technical skill categories.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Programming Languages"
              value={(formData.skills?.languages || []).join(', ')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSkills('languages', e.target.value)
              }
              placeholder="TypeScript, Python, JavaScript, Go"
            />
            <Input
              label="Backend Development"
              value={(formData.skills?.backend || []).join(', ')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSkills('backend', e.target.value)
              }
              placeholder="Node.js, Express, Django, REST API, GraphQL"
            />
            <Input
              label="Frontend Development"
              value={(formData.skills?.frontend || []).join(', ')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSkills('frontend', e.target.value)
              }
              placeholder="React, Vite, Next.js, Tailwind CSS"
            />
            <Input
              label="Databases & Caching"
              value={(formData.skills?.databases || []).join(', ')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSkills('databases', e.target.value)
              }
              placeholder="MongoDB, PostgreSQL, Redis"
            />
            <Input
              label="Cloud & DevOps"
              value={(formData.skills?.cloudDevOps || []).join(', ')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSkills('cloudDevOps', e.target.value)
              }
              placeholder="AWS, Docker, GitHub Actions, Linux"
            />
            <Input
              label="AI & Automation"
              value={(formData.skills?.aiAutomation || []).join(', ')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSkills('aiAutomation', e.target.value)
              }
              placeholder="Gemini API, Vector Embeddings, LangChain"
            />
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Experience */}
      {activeTab === 'experience' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Work Experience</CardTitle>
              <CardDescription>Professional roles and key achievements.</CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const list = [...(formData.experience || [])];
                list.push({ company: 'New Company', position: 'Software Engineer' });
                setFormData({ ...formData, experience: list });
              }}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Experience
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {(formData.experience || []).map((exp, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-slate-800 bg-slate-950 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200">Position #{idx + 1}</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose-400"
                    onClick={() => {
                      const list = (formData.experience || []).filter((_, i) => i !== idx);
                      setFormData({ ...formData, experience: list });
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Company"
                    value={exp.company || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const list = [...(formData.experience || [])];
                      list[idx].company = e.target.value;
                      setFormData({ ...formData, experience: list });
                    }}
                  />
                  <Input
                    label="Position / Title"
                    value={exp.position || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const list = [...(formData.experience || [])];
                      list[idx].position = e.target.value;
                      setFormData({ ...formData, experience: list });
                    }}
                  />
                </div>
                <Textarea
                  label="Description / Achievements"
                  rows={2}
                  value={exp.description || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const list = [...(formData.experience || [])];
                    list[idx].description = e.target.value;
                    setFormData({ ...formData, experience: list });
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tab: AI Intelligence Settings */}
      {activeTab === 'ai' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-400" /> Server AI Provider Health & Safeguards
            </CardTitle>
            <CardDescription>
              Configured AI engine provider status, model selection, rate limits, and daily token
              budgets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg border border-slate-800 bg-slate-950">
              <div>
                <span className="text-xs text-slate-400 block">Active Provider</span>
                <span className="text-sm font-bold text-indigo-400 capitalize mt-0.5 block">
                  {aiHealth?.configuredProvider || 'gemini'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Server API Key</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400">
                    Configured (Server Memory Only)
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Circuit Breaker State</span>
                <Badge
                  variant={aiHealth?.circuitState === 'closed' ? 'success' : 'danger'}
                  className="mt-0.5 capitalize"
                >
                  {aiHealth?.circuitState || 'closed'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Active Text Generation Model"
                value={aiHealth?.textModel || 'gemini-2.5-flash'}
                disabled
              />
              <Input
                label="Active Vector Embedding Model"
                value={aiHealth?.embeddingModel || 'gemini-embedding-2'}
                disabled
              />
              <Input
                label="Daily Request Usage"
                value={`${aiHealth?.dailyRequestsUsed || 0} / ${aiHealth?.dailyRequestLimit || 200} requests`}
                disabled
              />
              <Input
                label="Daily Token Budget Usage"
                value={`${aiHealth?.dailyTokensUsed || 0} / ${aiHealth?.dailyTokenBudget || 500000} tokens`}
                disabled
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Status Footer */}
      <div className="flex justify-between items-center rounded-lg border border-slate-800 bg-slate-900/80 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Database:</span>
            <Badge variant={dbData?.data?.database === 'connected' ? 'success' : 'danger'}>
              {dbData?.data?.database || 'disconnected'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">AI Service:</span>
            <Badge variant={aiHealth?.status === 'healthy' ? 'success' : 'warning'}>
              {aiHealth?.status || 'degraded'}
            </Badge>
          </div>
        </div>
        <Button onClick={handleSave} isLoading={saveMutation.isPending}>
          <Save className="h-4 w-4 mr-1.5" />
          Save Master Profile
        </Button>
      </div>
    </div>
  );
}
