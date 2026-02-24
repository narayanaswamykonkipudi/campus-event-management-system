import { useAuth } from '../../context/AuthContext';
import { events, registrations } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

export const MyTickets = () => {
    const { user } = useAuth();

    // Get only this student's registered upcoming/attended events
    const myRegs = registrations.filter(r => r.studentId === user?.id);
    const myTickets = myRegs
        .map(r => ({ reg: r, event: events.find(e => e.id === r.eventId) }))
        .filter(({ event }) => !!event);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
                <p className="text-gray-500 mt-1">Your event tickets and QR codes for entry.</p>
            </div>

            {myTickets.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                    <Ticket className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No tickets yet.</p>
                    <p className="text-sm text-gray-400 mt-1">Register for events to see your tickets here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myTickets.map(({ event, reg }, index) => {
                        const dateObj = new Date(event.eventDate);
                        const dateStr = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
                        const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
                        const isAttended = reg.attendanceStatus === 'Attended';

                        return (
                            <motion.div
                                key={reg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="flex flex-col md:flex-row p-0 overflow-hidden border border-gray-200 shadow-lg">
                                    {/* Main Ticket */}
                                    <div className="flex-1 p-6 flex flex-col justify-between bg-white relative">
                                        {/* Tear notch dots */}
                                        <div className="absolute -right-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-gray-50 border border-gray-200 z-10 hidden md:block" />

                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <Badge variant="neutral">{event.category}</Badge>
                                                {isAttended
                                                    ? <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Attended</span>
                                                    : <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">Upcoming</span>
                                                }
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900 mb-4">{event.title}</h2>
                                            <div className="space-y-2.5 text-gray-600 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 bg-gray-50 rounded-lg"><Calendar className="w-4 h-4 text-forest-900" /></div>
                                                    <span className="font-medium">{dateStr}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 bg-gray-50 rounded-lg"><Clock className="w-4 h-4 text-forest-900" /></div>
                                                    <span className="font-medium">{timeStr}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 bg-gray-50 rounded-lg"><MapPin className="w-4 h-4 text-forest-900" /></div>
                                                    <span className="font-medium">{event.department} Dept · Campus Hall</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                                            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Ticket Holder</p>
                                            <p className="font-bold text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-400">{user?.studentId} · {user?.department}</p>
                                        </div>
                                    </div>

                                    {/* QR Section */}
                                    <div className="bg-forest-900 text-white p-6 md:w-48 flex flex-col items-center justify-center relative border-l border-dashed border-white/20">
                                        <div className="absolute -left-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-gray-50 z-10 hidden md:block" />
                                        <div className="bg-white p-2 rounded-xl mb-3">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=CEMS-${reg.id}-${event.id}`}
                                                alt="QR Code"
                                                className="w-24 h-24"
                                            />
                                        </div>
                                        <p className="text-xs text-center text-gray-300 font-mono mb-3">{reg.id.toUpperCase()}</p>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isAttended ? 'bg-gray-400/20 text-gray-300' : 'bg-neon-green/20 text-neon-green'}`}>
                                            {isAttended ? 'Used' : 'Valid'}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
