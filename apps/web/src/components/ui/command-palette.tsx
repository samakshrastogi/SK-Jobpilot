import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, Briefcase, FileText, Video, Layers, Settings } from 'lucide-react';
import { Modal } from './modal';
import { Input } from './input';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');

  const actions = [
    { label: 'Discover Jobs', path: '/discover', icon: Compass },
    { label: 'Discovery Sources', path: '/discovery-sources', icon: Layers },
    { label: 'Application Tracker', path: '/applications', icon: Briefcase },
    { label: 'Resumes Workspace', path: '/resumes', icon: FileText },
    { label: 'AI Interview Simulator', path: '/interviews', icon: Video },
    { label: 'ATS Form Fixture Lab', path: '/ats-fixture-lab', icon: Layers },
    { label: 'Settings & System Health', path: '/settings', icon: Settings },
  ];

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Global Command Palette" maxWidth="lg">
      <div className="space-y-4">
        <Input
          placeholder="Search actions or navigate... (e.g. Discover, Interviews, Settings)"
          leftIcon={<Search className="h-4 w-4" />}
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          autoFocus
        />

        <div className="space-y-1 max-h-64 overflow-y-auto">
          {filtered.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.path}
                onClick={() => handleSelect(action.path)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-semibold text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors text-left"
              >
                <Icon className="h-4 w-4 text-indigo-400" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
