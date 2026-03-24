require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for enhanced seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Event.deleteMany({});
        await Registration.deleteMany({});
        console.log('Cleared existing data.');

        // 1. Create Admin
        await User.create({
            name: 'System Admin',
            age: 35,
            gender: 'Male',
            mobile: '9999999999',
            email: 'admin@campus.edu',
            password: 'adminpassword',
            role: 'admin'
        });

        // 2. Define Departments and Batches
        const depts = ['CSE', 'AIML', 'ECE'];
        const batches = [22, 23, 24, 25];
        const sections = ['A', 'B', 'C'];

        // 3. Create Faculty (1 per Dept)
        const facultyIds = [];
        for (const dept of depts) {
            const facultyEmail = `${dept.toLowerCase()}.faculty@campus.edu`;
            const facultyId = `FAC-${dept}-01`;
            const f = await User.create({
                name: `Prof. ${dept} Head`,
                age: 40 + Math.floor(Math.random() * 10),
                gender: 'Mixed',
                mobile: '8888880000',
                email: facultyEmail,
                password: facultyId,
                role: 'faculty',
                department: dept,
                collegeId: facultyId
            });
            facultyIds.push(f);
        }

        // 4. Create Students — 5 per section → 4 batches × 3 depts × 3 sections × 5 = 180 students
        const firstNames = [
            'Aarav', 'Aditi', 'Akash', 'Ananya', 'Arjun',
            'Bhavna', 'Chirag', 'Deepa', 'Divya', 'Gautam',
            'Harini', 'Ishaan', 'Jaya', 'Karthik', 'Kavya',
            'Lakshmi', 'Manoj', 'Meera', 'Naveen', 'Nisha',
            'Pooja', 'Pranav', 'Priya', 'Rahul', 'Rajan',
            'Ritu', 'Rohit', 'Sanjay', 'Shruti', 'Sneha',
            'Suresh', 'Tanvi', 'Uday', 'Varsha', 'Vijay',
            'Vishal', 'Yamini', 'Yash', 'Zara', 'Zoya'
        ];
        const lastNames = [
            'Sharma', 'Verma', 'Patel', 'Nair', 'Reddy',
            'Kumar', 'Singh', 'Iyer', 'Menon', 'Rao',
            'Gupta', 'Joshi', 'Pillai', 'Bhat', 'Desai',
            'Mehta', 'Shah', 'Chandra', 'Das', 'Malhotra'
        ];
        const usedNames = new Set();
        let nameIdx = 0;

        const getUniqueName = () => {
            // cycle through combos until unique
            while (nameIdx < firstNames.length * lastNames.length) {
                const first = firstNames[nameIdx % firstNames.length];
                const last  = lastNames[Math.floor(nameIdx / firstNames.length) % lastNames.length];
                nameIdx++;
                const full = `${first} ${last}`;
                if (!usedNames.has(full)) { usedNames.add(full); return full; }
            }
            // fallback (shouldn't happen for 180 students)
            return `Student ${nameIdx++}`;
        };

        const STUDENTS_PER_SECTION = 5;
        let mobileCounter = 9000000001;

        for (const batch of batches) {
            for (const dept of depts) {
                for (const section of sections) {
                    for (let num = 1; num <= STUDENTS_PER_SECTION; num++) {
                        const rollNo   = `${batch}${dept}-${section}-${String(num).padStart(3, '0')}`;
                        const gender   = Math.random() > 0.5 ? 'Male' : 'Female';
                        const fullName = getUniqueName();
                        await User.create({
                            name:       fullName,
                            age:        18 + (25 - batch),
                            gender:     gender,
                            mobile:     String(mobileCounter++),
                            email:      `${rollNo.toLowerCase().replace(/-/g, '')}@student.edu`,
                            password:   rollNo.toLowerCase().replace(/-/g, ''),
                            role:       'student',
                            year:       (25 - batch) + 1,  // Batch 25→Year 1, 22→Year 4
                            department: dept,
                            section:    section,
                            collegeId:  rollNo
                        });
                    }
                }
            }
        }

        // 5. Create 2 Events per Dept (6 total)
        const eventInfo = [
            { title: 'Code Genesis', dept: 'CSE' },
            { title: 'Data Viz 2.0', dept: 'CSE' },
            { title: 'AI Ethics Summit', dept: 'AIML' },
            { title: 'Neural Net Workshop', dept: 'AIML' },
            { title: 'Hardware Hack', dept: 'ECE' },
            { title: 'IoT Expo', dept: 'ECE' }
        ];

        const students = await User.find({ role: 'student' });
        console.log(`Creating events and registrations for ${students.length} students...`);

        for (const info of eventInfo) {
            const faculty = facultyIds.find(f => f.department === info.dept);
            if (!faculty) {
                console.error(`Faculty not found for dept: ${info.dept}`);
                continue;
            }

            const event = await Event.create({
                title: info.title,
                description: `Experience the best of ${info.dept} at ${info.title}. Open for wide participation with hands-on sessions.`,
                department: info.dept,
                createdBy: faculty._id,
                rules: "1. Respect all participants.\n2. Submit on time.\n3. Bring your ID card.",
                eligibleTags: {
                    year: [1, 2, 3, 4],
                    department: [info.dept, info.dept === 'CSE' ? 'AIML' : 'CSE'],
                    section: ['A', 'B', 'C']
                },
                maxRegistrations: 50,
                deadline: new Date('2026-12-25'),
                currentRegistrations: 0
            });

            const countToRegister = 20 + Math.floor(Math.random() * 10);
            const shuffled = [...students].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, countToRegister);

            for (const student of selected) {
                await Registration.create({
                    eventId: event._id,
                    studentId: student._id,
                    facultyId: faculty._id,
                    status: 'registered'
                });
            }

            event.currentRegistrations = countToRegister;
            await event.save();
        }

        console.log(`Seeding complete: 1 Admin, ${facultyIds.length} Faculty, ${students.length} Students, 6 Events.`);
        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
