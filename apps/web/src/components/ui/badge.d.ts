import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
declare const badgeVariants: (
  props?:
    | ({
        variant?:
          | 'default'
          | 'primary'
          | 'success'
          | 'warning'
          | 'danger'
          | 'info'
          | 'outline'
          | null
          | undefined;
      } & import('class-variance-authority/types').ClassProp)
    | undefined
) => string;
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}
export declare function Badge({ className, variant, ...props }: BadgeProps): React.JSX.Element;
export {};
//# sourceMappingURL=badge.d.ts.map
