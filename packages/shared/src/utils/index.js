export function formatDate(dateInput) {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime()))
        return 'N/A';
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
export function formatTimeAgo(dateInput) {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime()))
        return 'N/A';
    const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSeconds < 60)
        return `${diffSeconds}s ago`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60)
        return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24)
        return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
}
export function getMatchScoreColor(score) {
    if (score >= 85) {
        return {
            badge: 'emerald',
            text: 'text-emerald-700 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
        };
    }
    if (score >= 70) {
        return {
            badge: 'indigo',
            text: 'text-indigo-700 dark:text-indigo-400',
            bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
        };
    }
    if (score >= 50) {
        return {
            badge: 'amber',
            text: 'text-amber-700 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
        };
    }
    return {
        badge: 'slate',
        text: 'text-slate-700 dark:text-slate-400',
        bg: 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800',
    };
}
//# sourceMappingURL=index.js.map