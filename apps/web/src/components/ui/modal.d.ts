import * as React from 'react';
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}
export declare function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth,
}: ModalProps): React.JSX.Element | null;
//# sourceMappingURL=modal.d.ts.map
