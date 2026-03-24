const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');
const PDFDocument = require('pdfkit');

// Register for an event
router.post('/register/:eventId', verifyToken, async (req, res) => {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Only students can register for events.' });
    try {
        const { eventId } = req.params;
        const studentId = req.user.id;
        const event = await Event.findById(eventId);
        const student = await User.findById(studentId);
        if (!event) return res.status(404).json({ message: 'Event not found.' });
        const existingReg = await Registration.findOne({ eventId, studentId });
        if (existingReg) return res.status(400).json({ message: 'You have already registered for this event.' });
        if (new Date() > event.deadline) return res.status(400).json({ message: 'Registration deadline has passed.' });
        if (event.currentRegistrations >= event.maxRegistrations) return res.status(400).json({ message: 'Seats are full.' });
        const { year, department, section } = student;
        const isEligibleYear = event.eligibleTags.year.length === 0 || event.eligibleTags.year.includes(year);
        const isEligibleDept = event.eligibleTags.department.length === 0 || event.eligibleTags.department.includes(department);
        const isEligibleSection = event.eligibleTags.section.length === 0 || event.eligibleTags.section.includes(section);
        if (!isEligibleYear || !isEligibleDept || !isEligibleSection)
            return res.status(403).json({ message: 'You are not eligible for this event based on academic tags.' });
        const registration = new Registration({ eventId, studentId, facultyId: event.createdBy, status: 'registered' });
        await registration.save();
        event.currentRegistrations += 1;
        await event.save();
        res.status(201).json(registration);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// View my registrations (Student)
router.get('/my', verifyToken, async (req, res) => {
    try {
        const regs = await Registration.find({ studentId: req.user.id }).populate('eventId');
        res.json(regs);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// View all registrations for an event (Faculty/Admin)
router.get('/event/:eventId', verifyToken, async (req, res) => {
    try {
        const regs = await Registration.find({ eventId: req.params.eventId })
            .populate('studentId', 'name email year department section collegeId');
        res.json(regs);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH: Faculty assigns certificate types in bulk
router.patch('/event/:eventId/assign-certs', verifyToken, async (req, res) => {
    if (req.user.role !== 'faculty') return res.status(403).json({ message: 'Faculty only.' });
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ message: 'Event not found.' });
        if (event.createdBy.toString() !== req.user.id)
            return res.status(403).json({ message: 'Only the event creator can assign certificates.' });
        const { assignments } = req.body;
        if (!Array.isArray(assignments) || assignments.length === 0)
            return res.status(400).json({ message: 'assignments array is required.' });
        await Promise.all(assignments.map(({ registrationId, certificateType }) =>
            Registration.findByIdAndUpdate(registrationId, { certificateType }, { new: true })
        ));
        res.json({ message: 'Certificate assignments saved successfully.' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET: Generate and stream PDF certificate
router.get('/:registrationId/certificate', verifyToken, async (req, res) => {
    try {
        const reg = await Registration.findById(req.params.registrationId)
            .populate('studentId', 'name email department year collegeId')
            .populate('eventId', 'title description department eventDate deadline createdBy');

        if (!reg) return res.status(404).json({ message: 'Registration not found.' });
        if (req.user.role === 'student' && reg.studentId._id.toString() !== req.user.id)
            return res.status(403).json({ message: 'Access denied.' });
        if (!reg.certificateType || reg.certificateType === 'none')
            return res.status(403).json({ message: 'No certificate assigned.' });

        const eventEndDate = reg.eventId.eventDate || reg.eventId.deadline;
        if (new Date() < new Date(eventEndDate))
            return res.status(400).json({ message: 'Event has not ended yet.' });

        const student = reg.studentId;
        const event = reg.eventId;
        const isMerit = reg.certificateType === 'merit';

        // ── Colour palette per cert type ─────────────────────────────────────
        // Participation → Blue theme  |  Merit → Amber/Gold theme
        const BG_MAIN = isMerit ? '#D4960A' : '#1565D8';   // primary bg
        const BG_DARK = isMerit ? '#A8750A' : '#1044A8';   // darker panel / circles
        const BG_RIBBON = '#FFFFFF';                           // ribbon bookmark
        const TEXT_LIGHT = '#FFFFFF';
        const TEXT_SUB = isMerit ? '#FFF3C4' : '#BBCFFF';  // subtitles & labels
        const TEXT_EVENT = isMerit ? '#FFF8E1' : '#D0E4FF';  // event name colour
        const LOGO_COL = isMerit ? '#D4960A' : '#1565D8';  // logo colour inside ribbon

        const certTypeLabel = isMerit ? 'Certificate of Merit' : 'Certificate of Participation';

        // ── PDF setup ─────────────────────────────────────────────────────────
        // Use A4 landscape (841 × 595 pt)
        const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${certTypeLabel.replace(/ /g, '_')}_${(student.name || 'Student').replace(/\s+/g, '_')}.pdf"`);
        doc.pipe(res);

        const W = doc.page.width;   // ~841
        const H = doc.page.height; // ~595

        // ── 1. Full background ────────────────────────────────────────────────
        doc.rect(0, 0, W, H).fill(BG_MAIN);

        // ── 2. Decorative large circle — bottom-right background element ──────
        doc.circle(W + 40, H + 20, 260).fillOpacity(0.18).fill(BG_DARK);
        doc.fillOpacity(1); // reset

        // ── 3. Medium circle — upper-left background element ──────────────────
        doc.circle(-30, -30, 180).fillOpacity(0.14).fill(BG_DARK);
        doc.fillOpacity(1);

        // ── 4. Thin horizontal separator line — spans 80% of page width ──────
        doc.rect(58, H / 2 - 1, W * 0.80, 1.5).fill(TEXT_SUB);

        // ── 5. Ribbon bookmark shape — top left ───────────────────────────────
        // Classic downward-pointing bookmark (white)
        const ribX = 52, ribY = 0, ribW = 68, ribH = 100;
        const tipY = ribH;          // how far the vee dips
        doc.save();
        doc.moveTo(ribX, ribY)
            .lineTo(ribX + ribW, ribY)
            .lineTo(ribX + ribW, tipY)
            .lineTo(ribX + ribW / 2, tipY - 20)  // centre dip
            .lineTo(ribX, tipY)
            .closePath()
            .fill(BG_RIBBON);
        doc.restore();

        // ── Award badge logo inside ribbon ─────────────────────────────────
        // Outer circle ring
        const badgeCX = ribX + ribW / 2;
        const badgeCY = 42;
        doc.circle(badgeCX, badgeCY, 20).lineWidth(2.5).strokeColor(LOGO_COL).stroke();
        // Inner circle
        doc.circle(badgeCX, badgeCY, 14).lineWidth(1.2).strokeColor(LOGO_COL).strokeOpacity(0.5).stroke();
        doc.strokeOpacity(1);
        // ★ Star in centre
        function drawStar(doc, cx, cy, spikes, outerRadius, innerRadius, color) {
            let rot = Math.PI / 2 * 3;
            let x = cx;
            let y = cy;
            const step = Math.PI / spikes;

            doc.save();
            doc.moveTo(cx, cy - outerRadius);

            for (let i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                doc.lineTo(x, y);
                rot += step;

                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                doc.lineTo(x, y);
                rot += step;
            }

            doc.lineTo(cx, cy - outerRadius);
            doc.closePath();
            doc.fillColor(color).fill();
            doc.restore();
        }
        drawStar(doc, badgeCX, badgeCY, 5, 8, 4, LOGO_COL);

        // ── 6. "Certificate of Participation / Merit" — top right ─────────────
        doc.font('Helvetica').fontSize(14).fillColor(TEXT_LIGHT)
            .text(certTypeLabel, 0, 36, { align: 'right', width: W - 58 });

        // ── 7. "Awarded to" label ─────────────────────────────────────────────
        // Replace with student roll number (collegeId)
        const rollLabel = student.collegeId ? `Roll No: ${student.collegeId}` : 'Roll No: —';
        doc.font('Helvetica').fontSize(15).fillColor(TEXT_SUB)
            .text(rollLabel, 58, H * 0.30, { width: W * 0.70 });

        // ── 8. Student name — large bold ──────────────────────────────────────
        const nameY = H * 0.30 + 28;
        doc.font('Helvetica-Bold').fontSize(48).fillColor(TEXT_LIGHT)
            .text(student.name, 58, nameY, { width: W * 0.75, lineGap: -4 });

        // ── 9. "for completing:" subtext ──────────────────────────────────────
        const nameBlockH = doc.currentLineHeight() * Math.ceil(doc.widthOfString(student.name, { fontSize: 48 }) / (W * 0.75));
        const afterNameY = nameY + Math.max(nameBlockH, 56) + 14;

        doc.font('Helvetica').fontSize(14).fillColor(TEXT_SUB)
            .text('for completing:', 58, afterNameY);

        // ── 10. Event name + dept (bold, lighter shade) ───────────────────────
        const eventLine = `${event.title}  —  Dept. of ${event.department}`;
        doc.font('Helvetica-Bold').fontSize(22).fillColor(TEXT_EVENT)
            .text(eventLine, 58, afterNameY + 38, { width: W * 0.78 });

        // ── 11. Issue date — bottom left ──────────────────────────────────────
        const displayDate = new Date(eventEndDate).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        const issuedY = H - 50;
        doc.font('Helvetica').fontSize(11).fillColor(TEXT_SUB)
            .text('Issued on', 58, issuedY);
        doc.font('Helvetica-Bold').fontSize(11).fillColor(TEXT_LIGHT)
            .text(displayDate, 58 + doc.widthOfString('Issued on '), issuedY);

        doc.end();
    } catch (err) {
        console.error('Certificate generation error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
