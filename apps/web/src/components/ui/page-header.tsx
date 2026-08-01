import * as React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-800/80 mb-6">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1.5">
            {breadcrumbs.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 ? <ChevronRight className="h-3 w-3 text-slate-600" /> : null}
                {item.href ? (
                  <a href={item.href} className="hover:text-indigo-400 transition-colors">
                    {item.label}
                  </a>
                ) : (
                  <span className="text-slate-300 font-medium">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">{title}</h1>
        {description ? <p className="text-xs text-slate-400 mt-1">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2 mt-3 md:mt-0">{actions}</div> : null}
    </div>
  );
}
