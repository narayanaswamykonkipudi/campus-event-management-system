import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, delay = 0, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className={twMerge(
                "bg-white rounded-3xl p-6 shadow-sm shadow-gray-200/50 border border-gray-100/50",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};
