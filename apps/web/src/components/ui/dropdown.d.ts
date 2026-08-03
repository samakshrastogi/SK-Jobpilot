import * as React from 'react';
export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
}
export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}
export declare function Dropdown({ trigger, items, align }: DropdownProps): React.JSX.Element;
//# sourceMappingURL=dropdown.d.ts.map
