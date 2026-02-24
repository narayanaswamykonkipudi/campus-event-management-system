import { twMerge } from 'tailwind-merge';

export const Input = ({ className, ...props }) => {
    return (
        <input
            className={twMerge(
                "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-900/20 focus:border-forest-900 transition-all",
                className
            )}
            {...props}
        />
    );
};
