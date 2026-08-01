import * as React from 'react';
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
export declare function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps): React.JSX.Element;
//# sourceMappingURL=page-header.d.ts.map