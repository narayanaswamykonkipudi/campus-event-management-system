
// ============================================================
// USERS
// ============================================================
export const users = [
    {
        id: 'u1',
        name: 'Admin User',
        email: 'admin@college.edu',
        password: 'admin123',
        role: 'admin',
        department: 'Administration',
        status: 'active',
        joinedDate: '2023-07-01',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=064e3b&color=fff'
    },
    {
        id: 'u2',
        name: 'John Doe',
        email: 'john@student.edu',
        password: 'student123',
        role: 'student',
        department: 'Computer Science',
        year: '2nd',
        section: 'A',
        studentId: 'CS2024001',
        mobile: '9876543210',
        age: 20,
        gender: 'Male',
        meritPoints: 145,
        certificatesEarned: 3,
        status: 'active',
        joinedDate: '2024-06-01',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0ea5e9&color=fff'
    },
    {
        id: 'u3',
        name: 'Priya Sharma',
        email: 'priya@student.edu',
        password: 'student123',
        role: 'student',
        department: 'Electronics',
        year: '3rd',
        section: 'B',
        studentId: 'EC2024002',
        mobile: '9123456789',
        age: 21,
        gender: 'Female',
        meritPoints: 220,
        certificatesEarned: 5,
        status: 'active',
        joinedDate: '2024-06-01',
        avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=8b5cf6&color=fff'
    },
    {
        id: 'u4',
        name: 'Dr. Rajan Kumar',
        email: 'rajan@faculty.edu',
        password: 'faculty123',
        role: 'faculty',
        department: 'Computer Science',
        facultyId: 'FAC2023001',
        mobile: '9988776655',
        age: 42,
        gender: 'Male',
        status: 'active',
        joinedDate: '2023-06-01',
        avatar: 'https://ui-avatars.com/api/?name=Rajan+Kumar&background=f97316&color=fff'
    },
    {
        id: 'u5',
        name: 'Prof. Ananya Bose',
        email: 'ananya@faculty.edu',
        password: 'faculty123',
        role: 'faculty',
        department: 'Electronics',
        facultyId: 'FAC2023002',
        mobile: '9876501234',
        age: 38,
        gender: 'Female',
        status: 'active',
        joinedDate: '2023-06-01',
        avatar: 'https://ui-avatars.com/api/?name=Ananya+Bose&background=ec4899&color=fff'
    },
    {
        id: 'u6',
        name: 'Arjun Mehta',
        email: 'arjun@student.edu',
        password: 'student123',
        role: 'student',
        department: 'Mechanical',
        year: '1st',
        section: 'C',
        studentId: 'ME2024003',
        mobile: '9001234567',
        age: 19,
        gender: 'Male',
        meritPoints: 60,
        certificatesEarned: 1,
        status: 'active',
        joinedDate: '2024-06-10',
        avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=22c55e&color=fff'
    },
    {
        id: 'u7',
        name: 'Sneha Patel',
        email: 'sneha@student.edu',
        password: 'student123',
        role: 'student',
        department: 'Computer Science',
        year: '2nd',
        section: 'A',
        studentId: 'CS2024004',
        mobile: '9812345678',
        age: 20,
        gender: 'Female',
        meritPoints: 180,
        certificatesEarned: 4,
        status: 'inactive',
        joinedDate: '2024-06-01',
        avatar: 'https://ui-avatars.com/api/?name=Sneha+Patel&background=f59e0b&color=fff'
    }
];

// ============================================================
// DEPARTMENTS
// ============================================================
export const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Information Technology',
    'Administration'
];

// ============================================================
// CATEGORIES / EVENT TYPES
// ============================================================
export const categories = [
    { id: 'c1', name: 'Technical', color: 'bg-blue-500' },
    { id: 'c2', name: 'Cultural', color: 'bg-pink-500' },
    { id: 'c3', name: 'Sports', color: 'bg-orange-500' },
    { id: 'c4', name: 'Workshop', color: 'bg-purple-500' },
    { id: 'c5', name: 'Leadership', color: 'bg-teal-500' },
];

// ============================================================
// EVENTS
// ============================================================
export const events = [
    {
        id: 'e1',
        title: 'Hackathon 2025',
        description: '24-hour coding marathon to solve real-world problems. Teams of 3-4 will compete to build innovative solutions using modern tech stacks. Prizes worth ₹1,00,000 up for grabs!',
        department: 'Computer Science',
        createdBy: 'u4', // Dr. Rajan Kumar
        category: 'Technical',
        eventType: 'Technical',
        eventDate: '2025-09-15T09:00:00',
        registrationDeadline: '2025-09-10T23:59:00',
        maxParticipants: 200,
        currentParticipants: 87,
        status: 'Upcoming',
        allowedDepartments: ['Computer Science', 'Information Technology', 'Electronics'],
        allowedYears: ['2nd', '3rd', '4th'],
        allowedSections: ['A', 'B', 'C'],
        prizes: '1st: ₹50,000 | 2nd: ₹30,000 | 3rd: ₹20,000',
        guidelines: 'Bring your own laptop. Internet will be provided. No plagiarism.',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        id: 'e2',
        title: 'Music Fest Night',
        description: 'A night of mesmerizing melodies and energetic performances. Solo and group performances welcome. Open to all departments.',
        department: 'Electronics',
        createdBy: 'u5',
        category: 'Cultural',
        eventType: 'Cultural',
        eventDate: '2025-10-20T18:00:00',
        registrationDeadline: '2025-10-15T23:59:00',
        maxParticipants: 500,
        currentParticipants: 312,
        status: 'Upcoming',
        allowedDepartments: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology'],
        allowedYears: ['1st', '2nd', '3rd', '4th'],
        allowedSections: ['A', 'B', 'C', 'D'],
        prizes: 'Best Solo: ₹15,000 | Best Group: ₹25,000',
        guidelines: 'Performances must not exceed 10 minutes. Instruments provided on request.',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=600',
    },
    {
        id: 'e3',
        title: 'Inter-College Football',
        description: 'The ultimate football showdown between departments. Register your team and compete for the championship trophy.',
        department: 'Computer Science',
        createdBy: 'u4',
        category: 'Sports',
        eventType: 'Sports',
        eventDate: '2025-11-10T10:00:00',
        registrationDeadline: '2025-11-05T23:59:00',
        maxParticipants: 100,
        currentParticipants: 54,
        status: 'Upcoming',
        allowedDepartments: ['Computer Science', 'Electronics', 'Mechanical'],
        allowedYears: ['1st', '2nd', '3rd', '4th'],
        allowedSections: ['A', 'B', 'C'],
        prizes: 'Champions: ₹20,000 Trophy + Medal',
        guidelines: 'Teams of 11. Bring college ID. Proper sports attire required.',
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=600',
    },
    {
        id: 'e4',
        title: 'AI Workshop',
        description: 'Hands-on session on Generative AI fundamentals, prompt engineering, and building your first AI-powered app.',
        department: 'Computer Science',
        createdBy: 'u4',
        category: 'Workshop',
        eventType: 'Workshop',
        eventDate: '2025-08-10T14:00:00',
        registrationDeadline: '2025-08-05T23:59:00',
        maxParticipants: 50,
        currentParticipants: 50,
        status: 'Completed',
        allowedDepartments: ['Computer Science', 'Information Technology'],
        allowedYears: ['2nd', '3rd', '4th'],
        allowedSections: ['A', 'B'],
        prizes: 'Certificates for all participants',
        guidelines: 'Laptop required. Python basics preferred.',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
    },
    {
        id: 'e5',
        title: 'Leadership Summit 2025',
        description: 'Panel discussions, keynote speakers, and workshops on leadership, entrepreneurship, and career development.',
        department: 'Electronics',
        createdBy: 'u5',
        category: 'Leadership',
        eventType: 'Leadership',
        eventDate: '2025-09-25T09:00:00',
        registrationDeadline: '2025-09-20T23:59:00',
        maxParticipants: 150,
        currentParticipants: 98,
        status: 'Upcoming',
        allowedDepartments: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'],
        allowedYears: ['3rd', '4th'],
        allowedSections: ['A', 'B', 'C'],
        prizes: 'Participation Certificate + Industry Mentorship session',
        guidelines: 'Formal attire required. Registration closes strictly at deadline.',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
    },
    {
        id: 'e6',
        title: 'Circuit Design Challenge',
        description: 'Design the most innovative and efficient circuit to solve specified engineering problems.',
        department: 'Electronics',
        createdBy: 'u5',
        category: 'Technical',
        eventType: 'Technical',
        eventDate: '2025-08-20T10:00:00',
        registrationDeadline: '2025-08-15T23:59:00',
        maxParticipants: 60,
        currentParticipants: 60,
        status: 'Closed',
        allowedDepartments: ['Electronics', 'Electrical'],
        allowedYears: ['2nd', '3rd', '4th'],
        allowedSections: ['A', 'B'],
        prizes: '1st: ₹10,000 | 2nd: ₹6,000 | 3rd: ₹3,000',
        guidelines: 'Individual or pairs only. Components provided.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    },
];

// ============================================================
// REGISTRATIONS (Student event registrations)
// ============================================================
export const registrations = [
    {
        id: 'r1',
        studentId: 'u2', // John Doe
        eventId: 'e1',
        registrationDate: '2025-09-02',
        attendanceStatus: 'Registered',
        score: null,
        certificateIssued: false,
        certificateUrl: null,
    },
    {
        id: 'r2',
        studentId: 'u2',
        eventId: 'e4',
        registrationDate: '2025-08-01',
        attendanceStatus: 'Attended',
        score: 88,
        certificateIssued: true,
        certificateUrl: 'https://example.com/cert/r2.pdf',
    },
    {
        id: 'r3',
        studentId: 'u2',
        eventId: 'e2',
        registrationDate: '2025-10-05',
        attendanceStatus: 'Registered',
        score: null,
        certificateIssued: false,
        certificateUrl: null,
    },
    {
        id: 'r4',
        studentId: 'u3',
        eventId: 'e4',
        registrationDate: '2025-08-01',
        attendanceStatus: 'Attended',
        score: 95,
        certificateIssued: true,
        certificateUrl: 'https://example.com/cert/r4.pdf',
    },
    {
        id: 'r5',
        studentId: 'u2',
        eventId: 'e5',
        registrationDate: '2025-09-15',
        attendanceStatus: 'Absent',
        score: null,
        certificateIssued: false,
        certificateUrl: null,
    },
];

// ============================================================
// SCORE POLICIES
// ============================================================
export const scorePolicies = [
    { id: 'sp1', eventType: 'Technical', participationPoints: 10, winnerPoints: 50, runnerUpPoints: 30 },
    { id: 'sp2', eventType: 'Cultural', participationPoints: 8, winnerPoints: 40, runnerUpPoints: 25 },
    { id: 'sp3', eventType: 'Sports', participationPoints: 10, winnerPoints: 45, runnerUpPoints: 28 },
    { id: 'sp4', eventType: 'Workshop', participationPoints: 15, winnerPoints: 0, runnerUpPoints: 0 },
    { id: 'sp5', eventType: 'Leadership', participationPoints: 12, winnerPoints: 35, runnerUpPoints: 20 },
];

// ============================================================
// ADMIN STATISTICS (overview dashboard)
// ============================================================
export const stats = {
    totalEvents: 6,
    totalUsers: 7,
    totalRegistrations: 5,
    totalCertificates: 2,
    activeEvents: 4,
    departments: 7,
    registrationsOverTime: [
        { name: 'Mar', value: 30 },
        { name: 'Apr', value: 45 },
        { name: 'May', value: 80 },
        { name: 'Jun', value: 120 },
        { name: 'Jul', value: 150 },
        { name: 'Aug', value: 110 },
        { name: 'Sep', value: 175 },
    ],
    eventsByCategory: [
        { name: 'Technical', value: 2 },
        { name: 'Cultural', value: 1 },
        { name: 'Sports', value: 1 },
        { name: 'Workshop', value: 1 },
        { name: 'Leadership', value: 1 },
    ],
    attendanceRateByDept: [
        { name: 'CS', rate: 82 },
        { name: 'ECE', rate: 75 },
        { name: 'Mech', rate: 68 },
        { name: 'Civil', rate: 71 },
        { name: 'EE', rate: 79 },
    ],
    yearWiseParticipation: [
        { year: '1st', count: 45 },
        { year: '2nd', count: 120 },
        { year: '3rd', count: 98 },
        { year: '4th', count: 67 },
    ],
};

// ============================================================
// STUDENT STATISTICS
// ============================================================
export const studentStats = {
    eventsRegistered: 3,
    eventsAttended: 1,
    meritPoints: 145,
    certificatesEarned: 1,
    upcoming: 2,
    involvement: [
        { subject: 'Technical', A: 120, fullMark: 150 },
        { subject: 'Cultural', A: 98, fullMark: 150 },
        { subject: 'Sports', A: 86, fullMark: 150 },
        { subject: 'Workshop', A: 99, fullMark: 150 },
        { subject: 'Social', A: 85, fullMark: 150 },
        { subject: 'Leadership', A: 65, fullMark: 150 },
    ],
    participationTrend: [
        { month: 'Apr', events: 0 },
        { month: 'May', events: 1 },
        { month: 'Jun', events: 0 },
        { month: 'Jul', events: 0 },
        { month: 'Aug', events: 1 },
        { month: 'Sep', events: 1 },
    ],
};

// ============================================================
// FACULTY STATISTICS
// ============================================================
export const facultyStats = {
    totalEventsCreated: 3,
    totalRegistrations: 191,
    activeEvents: 2,
    completedEvents: 1,
    recentActivity: [
        { time: '2 hours ago', message: 'New registration: John Doe for Hackathon 2025' },
        { time: '5 hours ago', message: 'Registration deadline for Inter-College Football in 5 days' },
        { time: '1 day ago', message: 'AI Workshop attendance uploaded successfully' },
        { time: '2 days ago', message: 'Hackathon 2025 received 20 new registrations' },
    ],
};

// ============================================================
// TOP STUDENTS (for admin analytics)
// ============================================================
export const topStudents = [
    { rank: 1, name: 'Priya Sharma', department: 'Electronics', year: '3rd', eventsAttended: 8, meritPoints: 220 },
    { rank: 2, name: 'Sneha Patel', department: 'CS', year: '2nd', eventsAttended: 6, meritPoints: 180 },
    { rank: 3, name: 'John Doe', department: 'CS', year: '2nd', eventsAttended: 5, meritPoints: 145 },
    { rank: 4, name: 'Arjun Mehta', department: 'Mechanical', year: '1st', eventsAttended: 3, meritPoints: 60 },
];
