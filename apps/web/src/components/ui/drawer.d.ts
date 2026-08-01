import * as React from 'react';
export interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    side?: 'left' | 'right';
}
export declare function Drawer({ isOpen, onClose, title, children, side }: DrawerProps): React.JSX.Element | null;
//# sourceMappingURL=drawer.d.ts.map