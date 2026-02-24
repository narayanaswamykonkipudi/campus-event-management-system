import { twMerge } from 'tailwind-merge';

export const Badge = ({ children, variant = 'neutral', className }) => {
    const variants = {
        neutral: "bg-gray-100 text-gray-600",
        success: "bg-green-100 text-green-700",
        warning: "bg-orange-100 text-orange-700",
        danger: "bg-red-100 text-red-700",
        purple: "bg-purple-100 text-purple-700",
        blue: "bg-blue-100 text-blue-700"
    };

    return (
        <span className={twMerge(
            "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};
