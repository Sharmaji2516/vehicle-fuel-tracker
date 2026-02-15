// Theme-aware color utility
export const getThemeColors = (isDark) => ({
    // Card backgrounds
    cardBg: isDark ? 'bg-slate-800/50' : 'bg-gray-50',
    cardBorder: isDark ? 'border-slate-700' : 'border-gray-200',

    // Inner sections
    sectionBg: isDark ? 'bg-slate-700/30' : 'bg-gray-100',
    sectionBgLight: isDark ? 'bg-slate-700/20' : 'bg-gray-50',
    sectionBgDark: isDark ? 'bg-slate-700/50' : 'bg-gray-200',
    innerBorder: isDark ? 'border-slate-700' : 'border-gray-300',
    innerCardBg: isDark ? 'bg-slate-800/50' : 'bg-white',

    // Text colors
    textPrimary: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-slate-300' : 'text-gray-700',
    textTertiary: isDark ? 'text-slate-400' : 'text-gray-600',
    textMuted: isDark ? 'text-slate-500' : 'text-gray-500',

    // Button backgrounds
    buttonBg: isDark ? 'bg-gray-200' : 'bg-gray-200',
    buttonBorder: isDark ? 'border-slate-600' : 'border-gray-300',
    buttonText: isDark ? 'text-slate-300' : 'text-gray-700',
});
