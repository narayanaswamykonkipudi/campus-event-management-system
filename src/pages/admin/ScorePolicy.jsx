import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Save, CheckCircle } from 'lucide-react';
import { scorePolicies } from '../../data/mockData';
import { Card } from '../../components/ui/Card';

export const ScorePolicy = () => {
    const [policies, setPolicies] = useState(scorePolicies.map(p => ({ ...p })));
    const [saved, setSaved] = useState(false);

    const update = (id, field, val) => {
        setPolicies(prev => prev.map(p => p.id === id ? { ...p, [field]: Number(val) } : p));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await new Promise(r => setTimeout(r, 700));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-2">
                <Settings2 className="w-6 h-6 text-forest-900" />
                <h1 className="text-2xl font-bold text-gray-900">Score Policy</h1>
            </div>
            <p className="text-gray-500 text-sm mb-6">Configure merit points awarded for each event type and outcome.</p>

            <form onSubmit={handleSave} className="space-y-4">
                {policies.map((policy, i) => (
                    <motion.div key={policy.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-xl bg-forest-900/10 flex items-center justify-center text-forest-900 text-sm font-bold">{policy.eventType[0]}</span>
                                    {policy.eventType} Events
                                </h3>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { key: 'participationPoints', label: 'Participation Points', color: 'focus:border-blue-500 focus:ring-blue-500/20' },
                                    { key: 'winnerPoints', label: 'Winner Points', color: 'focus:border-yellow-500 focus:ring-yellow-500/20' },
                                    { key: 'runnerUpPoints', label: 'Runner-up Points', color: 'focus:border-orange-500 focus:ring-orange-500/20' },
                                ].map(field => (
                                    <div key={field.key}>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="500"
                                            value={policy[field.key]}
                                            onChange={e => update(policy.id, field.key, e.target.value)}
                                            className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 ${field.color}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            {policy.winnerPoints === 0 && policy.runnerUpPoints === 0 && (
                                <p className="text-xs text-gray-400 mt-2 italic">Workshop events award participation points only.</p>
                            )}
                        </Card>
                    </motion.div>
                ))}

                {saved && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl text-sm">
                        <CheckCircle className="w-4 h-4" /> Score policies saved successfully!
                    </motion.div>
                )}

                <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-forest-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-forest-800 transition-colors shadow-lg shadow-forest-900/20">
                    <Save className="w-4 h-4" /> Save Policy Changes
                </motion.button>
            </form>
        </div>
    );
};
