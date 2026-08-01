import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal } from './modal';
import { Button } from './button';
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', isLoading = false, variant = 'primary', }) {
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: title, description: description, maxWidth: "sm", children: _jsxs("div", { className: "flex items-center justify-end gap-2 mt-6", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: onClose, disabled: isLoading, children: cancelLabel }), _jsx(Button, { variant: variant, size: "sm", onClick: onConfirm, isLoading: isLoading, children: confirmLabel })] }) }));
}
//# sourceMappingURL=confirm-dialog.js.map