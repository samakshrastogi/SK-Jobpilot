import * as React from 'react';
export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}
export declare function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps): React.JSX.Element;
//# sourceMappingURL=empty-state.d.ts.map
