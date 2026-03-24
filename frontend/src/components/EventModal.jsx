import React from 'react';

const EventModal = ({ event, onClose }) => {
    if (!event) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h2>{event.title}</h2>
                    <button onClick={onClose} style={{ background: '#64748b', padding: '5px 10px' }}>&times;</button>
                </div>

                <p><strong>Department:</strong> {event.department}</p>
                <p><strong>Posted By:</strong> {event.createdBy?.name || 'Faculty'}</p>
                <hr />

                <h4>Description</h4>
                <p style={{ whiteSpace: 'pre-wrap' }}>{event.description}</p>

                <h4>Rules</h4>
                <p style={{ whiteSpace: 'pre-wrap' }}>{event.rules || 'No specific rules provided.'}</p>

                <h4>Eligibility</h4>
                <div>
                    <span className="tag">Years: {event.eligibleTags?.year?.join(', ') || 'All'}</span>
                    <span className="tag">Departments: {event.eligibleTags?.department?.join(', ') || 'All'}</span>
                    <span className="tag">Sections: {event.eligibleTags?.section?.join(', ') || 'All'}</span>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <p><strong>Registrations:</strong> {event.currentRegistrations} / {event.maxRegistrations}</p>
                    <p><strong>Deadline:</strong> {new Date(event.deadline).toLocaleDateString()}</p>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
