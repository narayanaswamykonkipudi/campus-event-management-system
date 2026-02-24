import { Download, Search, Mail } from 'lucide-react';
import { users, events } from '../../data/mockData';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const Attendees = () => {
    // Flatten data: Get all registrations
    // For demo, just showing all students and their registered events count
    const studentUsers = users.filter(u => u.role === 'student');

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Attendees</h1>
                    <p className="text-gray-500 mt-1">View and manage registered students.</p>
                </div>
                <Button variant="secondary">
                    <Download className="w-4 h-4" /> Export CSV
                </Button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-900/20"
                        />
                    </div>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Total Registrations</th>
                            <th className="px-6 py-4">Last Active</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {studentUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <img src={user.avatar} className="w-10 h-10 rounded-full border border-gray-200" alt="" />
                                        <div>
                                            <p className="font-bold text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="blue">5 Events</Badge>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    Today, 10:23 AM
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="success">Active</Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" className="p-2">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {/* Mock rows to fill table */}
                        {[1, 2, 3, 4].map(i => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                                        <div>
                                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                                            <div className="h-3 w-32 bg-gray-100 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><div className="h-6 w-16 bg-blue-50 rounded-full"></div></td>
                                <td className="px-6 py-4 text-sm text-gray-400">2 days ago</td>
                                <td className="px-6 py-4"><Badge variant="success">Active</Badge></td>
                                <td className="px-6 py-4"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
