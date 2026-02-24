import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyles = "px-6 py-2.5 rounded-full font-medium transition-colors flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-forest-900 text-white hover:bg-forest-800 shadow-lg shadow-forest-900/20",
        secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
        neon: "bg-neon-green text-black hover:bg-lime-400 shadow-lg shadow-neon-green/20"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
};
