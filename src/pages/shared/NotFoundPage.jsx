import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Rocket, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-md"
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="bg-forest-900 p-1.5 rounded-lg">
                        <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">CampusEvents</span>
                </div>

                {/* 404 number */}
                <motion.div
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-9xl font-extrabold text-gray-100 leading-none mb-4 select-none"
                >
                    404
                </motion.div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                <p className="text-gray-500 mb-8">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex gap-3 justify-center">
                    <Link to="/">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 bg-forest-900 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-forest-800 transition-colors"
                        >
                            <Home className="w-4 h-4" /> Go Home
                        </motion.button>
                    </Link>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};
