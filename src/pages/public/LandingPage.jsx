import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Calendar, MapPin, Users, Star, ChevronRight,
    Rocket, Trophy, Award, BookOpen, Zap, Shield,
    Facebook, Twitter, Instagram, Linkedin, Mail, Phone
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { events } from '../../data/mockData';

// ─── Animation helpers ─────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay },
});

// ─── Static Data ───────────────────────────────────────────────────────────────
const stats = [
    { value: '12,000+', label: 'Active Students' },
    { value: '350+', label: 'Events Per Year' },
    { value: '48', label: 'Departments' },
    { value: '96%', label: 'Satisfaction Rate' },
];

const features = [
    { icon: Zap, title: 'Instant Registration', desc: 'Register for events in one click and get an instant confirmation ticket.', color: 'bg-yellow-50 text-yellow-600' },
    { icon: Trophy, title: 'Merit Points', desc: 'Earn merit points for participation, attendance, and wins — build your campus profile.', color: 'bg-red-50 text-red-600' },
    { icon: Award, title: 'Digital Certificates', desc: 'Download verified digital certificates right from your dashboard after events.', color: 'bg-purple-50 text-purple-600' },
    { icon: BookOpen, title: 'Role-Based Dashboards', desc: 'Tailored views for students, faculty coordinators, and administrators.', color: 'bg-blue-50 text-blue-600' },
    { icon: Calendar, title: 'Smart Calendar', desc: 'Never miss an event — filter by department, type, or date with real-time updates.', color: 'bg-emerald-50 text-emerald-600' },
    { icon: Shield, title: 'Secure & Verified', desc: 'Authentication, role-based access, and data privacy built in from day one.', color: 'bg-orange-50 text-orange-600' },
];

const testimonials = [
    {
        name: 'Priya Sharma', role: '3rd Year · Electronics', rating: 5,
        text: 'CampusEvents completely changed how I experience college life. I\'ve attended 12 events this semester and earned 3 certificates!',
        avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=8b5cf6&color=fff',
    },
    {
        name: 'Dr. Rajan Kumar', role: 'Faculty Coordinator · CS', rating: 5,
        text: 'Managing 8 events simultaneously used to be chaotic. Now the whole process — from creation to attendance tracking — takes minutes.',
        avatar: 'https://ui-avatars.com/api/?name=Rajan+Kumar&background=f97316&color=fff',
    },
    {
        name: 'Arjun Mehta', role: '1st Year · Mechanical', rating: 5,
        text: 'As a fresher, discovering events was overwhelming. The browse page made it super easy to find what\'s relevant to my department.',
        avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=22c55e&color=fff',
    },
];

const steps = [
    { step: '01', title: 'Create an Account', desc: 'Register as a Student or Faculty member with your college email.' },
    { step: '02', title: 'Discover Events', desc: 'Browse upcoming events filtered by category, department, or year.' },
    { step: '03', title: 'Register & Participate', desc: 'One-click registration with instant ticket and email confirmation.' },
    { step: '04', title: 'Earn & Grow', desc: 'Collect merit points and download verified certificates after events.' },
];

const footerLinks = {
    'Platform': ['Browse Events', 'Register', 'Student Dashboard', 'Faculty Portal', 'Admin Panel'],
    'Resources': ['Help Center', 'Documentation', 'Event Guidelines', 'Certificate FAQ', 'Score Policy'],
    'College': ['About Us', 'Academic Calendar', 'Departments', 'Campus Map', 'Contact Admin'],
};

export const LandingPage = () => {
    const featuredEvents = events.slice(0, 4);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            {/* ═══ HERO ══════════════════════════════════════════════════════════ */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <Badge variant="success" className="mb-4">✨ New Academic Year 2025</Badge>
                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                            Elevate Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-900 to-emerald-400">
                                Campus Experience
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                            Discover, organize, and participate in the most exciting events happening across campus. From hackathons to music fests — it's all here.
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <Link to="/register">
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-2 bg-forest-900 text-white px-7 py-4 rounded-2xl text-lg font-semibold hover:bg-forest-800 transition-colors shadow-xl shadow-forest-900/30">
                                    Get Started <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                            <Link to="/login">
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-2 border-2 border-gray-200 text-gray-700 px-7 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-100 transition-colors">
                                    Sign In
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Bento Hero Graphic */}
                    <div className="relative h-[500px] hidden lg:block">
                        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-0 right-10 w-64 h-80 bg-forest-900 rounded-3xl shadow-2xl z-10 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600" className="object-cover w-full h-full opacity-80" alt="concert" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                <p className="font-bold text-lg">Music Night</p>
                                <p className="text-sm text-gray-300">October 20th</p>
                            </div>
                        </motion.div>
                        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            className="absolute bottom-10 left-10 w-72 h-64 bg-white rounded-3xl shadow-xl z-20 p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-orange-100 rounded-2xl text-orange-600"><Users className="w-6 h-6" /></div>
                                <span className="text-4xl font-extrabold text-gray-900">12k+</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Students Active</h3>
                                <p className="text-gray-500 text-sm">Join the largest campus community</p>
                            </div>
                        </motion.div>
                        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}
                            className="absolute top-32 left-4 bg-emerald-500 text-white rounded-2xl p-4 shadow-lg z-30">
                            <Trophy className="w-6 h-6 mb-1" />
                            <p className="text-xs font-bold">350+ Events</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══ STATS ═════════════════════════════════════════════════════════ */}
            <section className="py-14 bg-forest-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((s, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.1)} className="text-center">
                                <p className="text-4xl font-extrabold text-white mb-1">{s.value}</p>
                                <p className="text-emerald-300 text-sm font-medium">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FEATURED EVENTS ═══════════════════════════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
                        <div>
                            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-2">Happening Now</p>
                            <h2 className="text-4xl font-bold text-gray-900">Featured Events</h2>
                            <p className="text-gray-500 text-lg mt-1">Don't miss the highlights of this semester.</p>
                        </div>
                        <Link to="/login" className="flex items-center gap-1 text-forest-900 font-semibold hover:underline text-sm">
                            View all events <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[380px]">
                        {featuredEvents.map((event, index) => (
                            <motion.div key={event.id} {...fadeUp(index * 0.08)}
                                className={`group relative overflow-hidden rounded-3xl shadow-lg cursor-pointer ${index === 0 ? 'md:col-span-2' : ''}`}>
                                <img
                                    src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'}
                                    alt={event.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-7 flex flex-col justify-end">
                                    <span className="text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full w-fit mb-3">
                                        {event.category}
                                    </span>
                                    <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                                    <div className="flex items-center gap-4 text-gray-300 text-sm">
                                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {event.currentParticipants} registered</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FEATURES ══════════════════════════════════════════════════════ */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeUp()} className="text-center mb-14">
                        <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-2">Why CampusEvents?</p>
                        <h2 className="text-4xl font-bold text-gray-900">Everything you need in one place</h2>
                        <p className="text-gray-500 text-lg mt-2 max-w-xl mx-auto">Built specifically for college communities — students, faculty, and admins all have their own powerful hub.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div key={i} {...fadeUp(i * 0.07)}>
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                        <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-4`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══ HOW IT WORKS ══════════════════════════════════════════════════ */}
            <section id="how-it-works" className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeUp()} className="text-center mb-14">
                        <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-2">Simple Process</p>
                        <h2 className="text-4xl font-bold text-gray-900">How it works</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((s, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.1)}>
                                <Card className="text-center relative">
                                    <div className="text-5xl font-extrabold text-gray-100 mb-3 leading-none">{s.step}</div>
                                    <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
                                    <p className="text-gray-500 text-sm">{s.desc}</p>
                                    {i < steps.length - 1 && (
                                        <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                                            <ChevronRight className="w-6 h-6 text-gray-300" />
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ TESTIMONIALS ══════════════════════════════════════════════════ */}
            <section id="testimonials" className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeUp()} className="text-center mb-14">
                        <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-2">Loved by Students & Faculty</p>
                        <h2 className="text-4xl font-bold text-gray-900">What people are saying</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.12)}>
                                <Card className="h-full">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(t.rating)].map((_, s) => (
                                            <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed mb-6">"{t.text}"</p>
                                    <div className="flex items-center gap-3 mt-auto">
                                        <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                                            <p className="text-xs text-gray-400">{t.role}</p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CTA BANNER ════════════════════════════════════════════════════ */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeUp()}
                        className="bg-forest-900 rounded-3xl p-12 text-center relative overflow-hidden">
                        {/* Decorative blobs */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl" />
                        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-800/40 rounded-full blur-2xl" />

                        <Rocket className="w-12 h-12 text-emerald-400 mx-auto mb-5" />
                        <h2 className="text-4xl font-extrabold text-white mb-4">Ready to get started?</h2>
                        <p className="text-emerald-200 text-lg max-w-xl mx-auto mb-8">
                            Join thousands of students already using CampusEvents to make the most of their college years.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link to="/register">
                                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                    className="bg-white text-forest-900 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-gray-50 transition-colors shadow-xl">
                                    Create Free Account
                                </motion.button>
                            </Link>
                            <Link to="/login">
                                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                    className="border-2 border-white/30 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-white/10 transition-colors">
                                    Sign In
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══ FOOTER ════════════════════════════════════════════════════════ */}
            <footer className="bg-gray-900 text-gray-400 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
                        {/* Brand */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-forest-900 p-1.5 rounded-lg">
                                    <Rocket className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white tracking-tight">CampusEvents</span>
                            </div>
                            <p className="text-sm leading-relaxed mb-6 max-w-xs">
                                The all-in-one campus event management platform connecting students, faculty, and administrators.
                            </p>
                            <div className="flex gap-3">
                                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                    <a key={i} href="#" className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-forest-900 hover:text-white transition-colors">
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Link columns */}
                        {Object.entries(footerLinks).map(([heading, links]) => (
                            <div key={heading}>
                                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">{heading}</h4>
                                <ul className="space-y-2.5">
                                    {links.map(link => (
                                        <li key={link}>
                                            <a href="#" className="text-sm hover:text-white transition-colors">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm">© 2025 CampusEvents. All rights reserved.</p>
                        <div className="flex items-center gap-6 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="mailto:admin@college.edu" className="flex items-center gap-1.5 hover:text-white transition-colors">
                                <Mail className="w-3.5 h-3.5" /> admin@college.edu
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
