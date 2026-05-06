import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const PROFESSORS = [
  { id: 1, name: "Mr. Dominic Guiritan", subject: "Integrative Programming 1", avatar: "DG", level: "College", availability: ["8:00 AM", "10:00 AM", "1:00 PM"] },
  { id: 2, name: "Mr. Romel Conquilla", subject: "Information Management", avatar: "RC", level: "College", availability: ["9:00 AM", "11:00 AM", "2:00 PM"] },
  { id: 3, name: "Mr. John Ray Subrastas", subject: "Application Development and Emerging Technologies", avatar: "JS", level: "College", availability: ["10:30 AM", "1:30 PM", "3:30 PM"] },
  { id: 4, name: "Mr. Herman Zafra", subject: "Theology", avatar: "HZ", level: "College", availability: ["1:00 PM", "2:30 PM", "4:00 PM"] },
  { id: 6, name: "Ms. Kryzl Rivera", subject: "Mathematics", avatar: "KR", level: "Basic Ed", availability: ["8:00 AM", "9:30 AM", "1:00 PM"] },
  { id: 7, name: "Ms. Sheryn Cuabo", subject: "Araling Panlipunan", avatar: "SC", level: "Basic Ed", availability: ["10:00 AM", "11:30 AM", "2:00 PM"] },
  { id: 8, name: "Ms. Charlotte Cirilo", subject: "English", avatar: "CC", level: "Basic Ed", availability: ["9:00 AM", "1:00 PM", "3:00 PM"] },
  { id: 10, name: "Mr. Herman Zafra", subject: "Theology", avatar: "HZ", level: "Basic Ed", availability: ["7:30 AM", "9:00 AM", "2:00 PM"] }
];

const INITIAL_APPOINTMENTS = [
  { 
    id: 1, 
    name: "Mr. Dominic Guiritan", 
    subject: "Integrative Programming 1", 
    date: "2026-03-20", 
    time: "8:00 - 9:00 AM", 
    location: "Room 204, Building A", 
    level: "College", 
    type: "upcoming", 
    avatar: "DG",
    description: "Integrative Programming 1 - A focused session to help you understand key concepts and improve your performance in Integrative Programming 1."
  },
  { 
    id: 2, 
    name: "Ms. Kryzl Rivera", 
    subject: "Mathematics", 
    date: "2026-03-22", 
    time: "9:30 - 10:30 AM", 
    location: "Room 101, Building B", 
    level: "Basic Ed", 
    type: "upcoming", 
    avatar: "KR",
    description: "Mathematics - A deep dive into core mathematical principles to strengthen your analytical skills."
  }
];

const INITIAL_ALERTS = [
  { id: 1, title: "Welcome", message: "Ready to schedule?", time: "Just now", type: "info" }
];

// --- HELPERS ---
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const Icon = ({ name, className = "" }) => (
  <span className={`material-icons-round ${className}`}>{name}</span>
);

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

// --- SUB-COMPONENTS ---

const AppointmentCard = ({ appt, onClick }) => (
  <div className="card appt-card clickable" onClick={onClick} style={{padding: '16px', marginBottom: '12px'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
        <div className="avatar-small">{appt.avatar}</div>
        <div>
          <p style={{fontSize: '14px', fontWeight: '700', color: '#1e293b'}}>{appt.name}</p>
          <p style={{fontSize: '11px', color: '#64748b'}}>{formatDate(appt.date)} • {appt.time}</p>
        </div>
      </div>
      <Icon name="chevron_right" style={{color: '#cbd5e1'}} />
    </div>
  </div>
);

const CalendarGrid = ({ onSelect, selectedDate }) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = [];
  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - today.getDay());
  for (let i = 0; i < 21; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return (
    <div className="calendar-grid">
      <div className="calendar-header">{days.map(d => <span key={d}>{d}</span>)}</div>
      <div className="calendar-body">
        {dates.map((d, i) => {
          const isSunday = d.getDay() === 0;
          const isPast = d < new Date().setHours(0,0,0,0);
          const dateStr = d.toISOString().split('T')[0];
          const active = selectedDate === dateStr;
          return (
            <button key={i} disabled={isSunday || isPast} onClick={() => onSelect(dateStr)} className={`calendar-day ${isSunday ? 'sunday' : ''} ${isPast ? 'past' : ''} ${active ? 'active' : ''}`}>{d.getDate()}</button>
          );
        })}
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [view, setView] = useState('login');
  const [role, setRole] = useState('student');
  const [level, setLevel] = useState('College');
  const [tab, setTab] = useState('upcoming');
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [newAppt, setNewAppt] = useState({ profId: null, date: "", time: "", step: 'level' });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = () => {
    if (!newAppt.profId || !newAppt.date || !newAppt.time) return showToast("Fill all fields");
    const prof = PROFESSORS.find(p => p.id === newAppt.profId);
    if (modal === 'reschedule') {
      setAppointments(appointments.map(a => a.id === selectedAppt.id ? { ...a, date: newAppt.date, time: newAppt.time } : a));
      setAlerts([{ id: Date.now(), title: "Rescheduled", message: `Updated meeting with ${prof.name}`, time: "Just now", type: "info" }, ...alerts]);
      showToast("Updated!");
    } else {
      const appt = { 
        id: Date.now(), name: prof.name, subject: prof.subject, date: newAppt.date, time: newAppt.time, 
        location: "Room 204, Building A", level: prof.level, type: "upcoming", avatar: prof.avatar,
        description: `${prof.subject} - A focused session to help you understand key concepts.`
      };
      setAppointments([appt, ...appointments]);
      setAlerts([{ id: Date.now(), title: "Confirmed", message: `New meeting with ${prof.name}`, time: "Just now", type: "success" }, ...alerts]);
      showToast("Scheduled!");
    }
    setModal(null);
  };

  return (
    <div className="app-container" style={{background: '#f8f9fa'}}>
      <AnimatePresence mode="wait">
        {view === 'login' && (
          <motion.div key="login" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="header-blue" style={{borderRadius: '0 0 32px 32px', padding: '64px 24px 48px'}}>
              <div className="logo-box" style={{margin: '0 auto 24px', width: '100px', height: '100px', borderRadius: '24px'}}><img src="/logo.jpg" alt="Logo" /></div>
              <h1 style={{fontSize: '32px', fontWeight: '800', textAlign: 'center', color: 'white', marginBottom: '8px'}}>Welcome, Urian!</h1>
              <p style={{fontSize: '15px', textAlign: 'center', color: 'rgba(255,255,255,0.8)'}}>Sign in to continue</p>
            </div>
            <div className="content" style={{paddingTop: '32px'}}>
              <p style={{fontSize: '13px', fontWeight: '700', color: '#7b8da4', marginBottom: '16px'}}>I am a</p>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px'}}>
                <button onClick={() => setRole('student')} className={`card ${role === 'student' ? 'active-role' : ''}`} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 16px', background: 'white', border: role === 'student' ? '2px solid #1a73e8' : '1px solid #f1f5f9'}}>
                  <Icon name="school" style={{fontSize: '28px', color: role === 'student' ? '#1a73e8' : '#64748b'}} /><span style={{fontSize: '14px', fontWeight: '700', color: role === 'student' ? '#1a73e8' : '#64748b'}}>Student</span>
                </button>
                <button onClick={() => setRole('teacher')} className={`card ${role === 'teacher' ? 'active-role' : ''}`} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 16px', background: 'white', border: role === 'teacher' ? '2px solid #1a73e8' : '1px solid #f1f5f9'}}>
                  <Icon name="menu_book" style={{fontSize: '28px', color: role === 'teacher' ? '#1a73e8' : '#64748b'}} /><span style={{fontSize: '14px', fontWeight: '700', color: role === 'teacher' ? '#1a73e8' : '#64748b'}}>Teacher</span>
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setView('home'); }}>
                <div className="input-group"><label className="input-label" style={{fontSize: '14px', color: '#1e293b'}}>Email</label><div className="input-field-wrap"><Icon name="mail_outline" className="input-icon-left" /><input type="email" placeholder="Enter your email" className="input-field" style={{paddingLeft: '52px'}} required /></div></div>
                <div className="input-group"><label className="input-label" style={{fontSize: '14px', color: '#1e293b'}}>Password</label><div className="input-field-wrap"><Icon name="lock_outline" className="input-icon-left" /><input type="password" placeholder="Enter your password" className="input-field" style={{paddingLeft: '52px'}} required /><Icon name="visibility_off" className="input-icon-right" style={{color: '#cbd5e1'}} /></div></div>
                <div style={{textAlign: 'right', marginTop: '-8px', marginBottom: '32px'}}><span style={{fontSize: '14px', fontWeight: '700', color: '#1a73e8', cursor: 'pointer'}}>Forgot Password?</span></div>
                <button type="submit" className="btn-primary-pop" style={{height: '60px', borderRadius: '16px'}}>Sign In</button>
              </form>
            </div>
          </motion.div>
        )}

        {view === 'home' && (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="header-blue" style={{textAlign: 'left', paddingBottom: '60px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div><h1 style={{fontSize: '28px', fontWeight: '800'}}>Good Day!</h1><p style={{fontSize: '14px', opacity: 0.9}}>Ready to schedule?</p></div>
                <div style={{display: 'flex', gap: '12px'}}><button className="icon-btn-blur" onClick={() => setView('alerts')}><Icon name="notifications" /></button><button className="icon-btn-blur" onClick={() => setView('login')}><Icon name="logout" /></button></div>
              </div>
            </div>
            <div className="content" style={{marginTop: '-40px'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px'}}>
                <div onClick={() => { setLevel('Basic Ed'); setView('schedule'); }} className="card clickable-pop" style={{padding: '24px'}}><div className="icon-wrap-blue"><Icon name="auto_stories" /></div><h3 style={{fontSize: '16px', fontWeight: '800'}}>Basic Ed</h3></div>
                <div onClick={() => { setLevel('College'); setView('schedule'); }} className="card clickable-pop" style={{padding: '24px'}}><div className="icon-wrap-blue"><Icon name="auto_awesome" /></div><h3 style={{fontSize: '16px', fontWeight: '800'}}>College</h3></div>
              </div>
              <button className="btn-primary-pop" style={{marginBottom: '32px'}} onClick={() => { setNewAppt({profId: null, date: "", time: "", step: 'level'}); setModal('schedule'); }}>
                <Icon name="add" /> NEW APPOINTMENT
              </button>
              <h2 style={{fontSize: '18px', fontWeight: '800', marginBottom: '20px'}}>UPCOMING</h2>
              {appointments.filter(a => a.type === 'upcoming').map(appt => <AppointmentCard key={appt.id} appt={appt} onClick={() => { setSelectedAppt(appt); setView('detail'); }} />)}
            </div>
          </motion.div>
        )}

        {view === 'schedule' && (
          <motion.div key="schedule" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="header-plain" style={{justifyContent: 'flex-start', gap: '24px'}}>
              <button className="back-btn" onClick={() => setView('home')}><Icon name="arrow_back" /></button>
              <h2 style={{fontSize: '20px', fontWeight: '800', flex: 1, textAlign: 'center', marginRight: '48px'}}>{level}</h2>
            </div>
            <div className="content">
              <div className="tabs-pill" style={{marginBottom: '32px'}}><button className={`tab-item ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>Upcoming</button><button className={`tab-item ${tab === 'past' ? 'active' : ''}`} onClick={() => setTab('past')}>History</button></div>
              {appointments.filter(a => a.level === level && a.type === tab).map(appt => <AppointmentCard key={appt.id} appt={appt} onClick={() => { setSelectedAppt(appt); setView('detail'); }} />)}
            </div>
          </motion.div>
        )}

        {view === 'detail' && selectedAppt && (
          <motion.div key="detail" variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{background: '#f8f9fa', minHeight: '100vh'}}>
            <div className="header-plain" style={{justifyContent: 'flex-start', gap: '24px'}}>
              <button className="back-btn" onClick={() => setView('schedule')}><Icon name="arrow_back" /></button>
              <h2 style={{fontSize: '20px', fontWeight: '800', flex: 1, textAlign: 'center', marginRight: '48px'}}>Appointment Details</h2>
            </div>
            <div className="content" style={{padding: '16px'}}>
              <div className="card" style={{padding: '0', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: '32px', border: '1px solid #f1f5f9'}}>
                <div style={{padding: '32px', display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '1px solid #f8fafc'}}>
                  <div className="avatar-circle" style={{width: '90px', height: '90px', background: '#94a3b8', color: 'white'}}><Icon name="person" style={{fontSize: '48px'}} /></div>
                  <div><h3 style={{fontSize: '20px', fontWeight: '800', marginBottom: '4px'}}>{selectedAppt.name}</h3><p style={{fontSize: '15px', color: '#7b8da4', marginBottom: '8px'}}>{selectedAppt.subject}</p><span className="badge-blue" style={{background: '#eff6ff', color: '#1a73e8', padding: '4px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: '600'}}>{selectedAppt.level}</span></div>
                </div>
                <div style={{padding: '24px 32px'}}>
                  <p style={{fontSize: '13px', fontWeight: '700', color: '#7b8da4', marginBottom: '20px'}}>Appointment Information</p>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <div style={{display: 'flex', gap: '16px'}}><div style={{background: '#eff6ff', color: '#1a73e8', padding: '10px', borderRadius: '12px'}}><Icon name="calendar_today" /></div><div><p style={{fontSize: '12px', color: '#94a3b8'}}>Date</p><p style={{fontSize: '15px', fontWeight: '700'}}>{formatDate(selectedAppt.date)}</p></div></div>
                    <div style={{display: 'flex', gap: '16px'}}><div style={{background: '#eff6ff', color: '#1a73e8', padding: '10px', borderRadius: '12px'}}><Icon name="schedule" /></div><div><p style={{fontSize: '12px', color: '#94a3b8'}}>Time</p><p style={{fontSize: '15px', fontWeight: '700'}}>{selectedAppt.time}</p></div></div>
                    <div style={{display: 'flex', gap: '16px'}}><div style={{background: '#eff6ff', color: '#1a73e8', padding: '10px', borderRadius: '12px'}}><Icon name="location_on" /></div><div><p style={{fontSize: '12px', color: '#94a3b8'}}>Location</p><p style={{fontSize: '15px', fontWeight: '700'}}>{selectedAppt.location}</p></div></div>
                  </div>
                </div>
                <div style={{padding: '0 32px 24px', borderBottom: '1px solid #f8fafc'}}><p style={{fontSize: '13px', fontWeight: '700', color: '#7b8da4', marginBottom: '12px'}}>Session Details</p><p style={{fontSize: '14px', color: '#475569', lineHeight: '1.6'}}>{selectedAppt.description}</p></div>
                <div style={{padding: '24px 32px 32px', background: '#f8fafc'}}>
                  <p style={{fontSize: '13px', fontWeight: '700', color: '#7b8da4', marginBottom: '20px'}}>Contact Instructor</p>
                  <button className="btn-primary-pop" style={{marginBottom: '12px', height: '60px', borderRadius: '16px'}} onClick={() => setModal('message')}><Icon name="chat_bubble" /> Send a Message</button>
                  <button className="btn-outline" style={{height: '60px', borderRadius: '16px', background: 'white'}} onClick={() => setModal('email')}><Icon name="mail_outline" /> Send an Email</button>
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px'}}><button className="btn-grey" style={{padding: '18px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '16px'}} onClick={() => { const prof = PROFESSORS.find(p => p.name === selectedAppt.name); setNewAppt({ profId: prof?.id || 1, date: selectedAppt.date, time: selectedAppt.time, step: 'date' }); setModal('reschedule'); }}>Reschedule</button><button className="btn-danger-outline" style={{padding: '18px', borderRadius: '16px', background: 'white'}} onClick={() => { setAppointments(appointments.filter(a => a.id !== selectedAppt.id)); setAlerts([{ id: Date.now(), title: "Cancelled", message: `Meeting with ${selectedAppt.name} removed`, time: "Just now", type: "info" }, ...alerts]); setView('schedule'); showToast("Removed"); }}>Cancel</button></div>
            </div>
          </motion.div>
        )}

        {view === 'alerts' && (
          <motion.div key="alerts" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="header-plain" style={{justifyContent: 'flex-start', gap: '24px'}}>
              <button className="back-btn" onClick={() => setView('home')}><Icon name="arrow_back" /></button>
              <h2 style={{fontSize: '20px', fontWeight: '800', flex: 1, textAlign: 'center', marginRight: '48px'}}>Notifications</h2>
            </div>
            <div className="content">
              {alerts.length === 0 ? (<div style={{textAlign: 'center', padding: '48px 0'}}><Icon name="notifications_off" style={{fontSize: '64px', color: '#cbd5e1', marginBottom: '16px'}} /><p style={{color: '#94a3b8', fontSize: '15px'}}>No notifications yet</p></div>) : (
                alerts.map(alert => (
                  <div key={alert.id} className="card" style={{display: 'flex', gap: '16px', marginBottom: '16px', borderLeft: `6px solid ${alert.type === 'success' ? '#10b981' : '#3b82f6'}`, padding: '20px'}}>
                    <div style={{background: alert.type === 'success' ? '#ecfdf5' : '#eff6ff', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name={alert.type === 'success' ? 'check_circle' : 'info'} style={{color: alert.type === 'success' ? '#10b981' : '#1a73e8'}} /></div>
                    <div style={{flex: 1}}><div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}><h4 style={{fontSize: '16px', fontWeight: '800'}}>{alert.title}</h4><span style={{fontSize: '11px', color: '#94a3b8'}}>{alert.time}</span></div><p style={{fontSize: '14px', color: '#64748b'}}>{alert.message}</p></div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(modal === 'schedule' || modal === 'reschedule') && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="modal-sheet" style={{maxHeight: '92vh', overflowY: 'auto'}} onClick={e => e.stopPropagation()}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}><h2 style={{fontSize: '22px', fontWeight: '800'}}>{modal === 'reschedule' ? 'Reschedule' : 'New Appointment'}</h2><button className="back-btn" onClick={() => setModal(null)}><Icon name="close" /></button></div>
              {newAppt.step === 'level' && modal !== 'reschedule' && (<div className="fade-in"><div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}><button className="card clickable-pop" style={{padding: '24px'}} onClick={() => { setLevel('Basic Ed'); setNewAppt({...newAppt, step: 'prof'}); }}>Basic Ed</button><button className="card clickable-pop" style={{padding: '24px'}} onClick={() => { setLevel('College'); setNewAppt({...newAppt, step: 'prof'}); }}>College</button></div></div>)}
              {newAppt.step === 'prof' && (<div className="fade-in"><div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>{PROFESSORS.filter(p => p.level === level).map(p => (<div key={p.id} onClick={() => setNewAppt({...newAppt, profId: p.id, step: 'date'})} className="card clickable" style={{padding: '16px', display: 'flex', alignItems: 'center', gap: '16px'}}><div className="avatar-small">{p.avatar}</div><div style={{flex: 1}}><p style={{fontSize: '15px', fontWeight: '800'}}>{p.name}</p><p style={{fontSize: '12px', color: '#64748b'}}>{p.subject}</p></div></div>))}</div></div>)}
              {newAppt.step === 'date' && (<div className="fade-in"><CalendarGrid selectedDate={newAppt.date} onSelect={(d) => setNewAppt({...newAppt, date: d, step: 'time'})} /></div>)}
              {newAppt.step === 'time' && (<div className="fade-in"><div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px'}}>{(PROFESSORS.find(p => p.id === newAppt.profId) || PROFESSORS[0]).availability.map(slot => (<button key={slot} onClick={() => setNewAppt({...newAppt, time: slot})} className={`time-chip ${newAppt.time === slot ? 'active' : ''}`}>{slot}</button>))}</div><button className="btn-primary-pop" style={{marginTop: '32px'}} onClick={handleCreate}>Confirm</button></div>)}
            </motion.div>
          </div>
        )}
        {(modal === 'message' || modal === 'email') && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="modal-sheet" onClick={e => e.stopPropagation()}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}><h2 style={{fontSize: '20px', fontWeight: '800'}}>{modal === 'message' ? 'Send Message' : 'Send Email'}</h2><button className="back-btn" onClick={() => setModal(null)}><Icon name="close" /></button></div>
              <textarea placeholder="Type here..." className="input-field" style={{height: '150px', paddingTop: '16px', paddingLeft: '16px', resize: 'none'}} />
              <button className="btn-primary-pop" style={{marginTop: '24px'}} onClick={() => { showToast("Sent Successfully!"); setModal(null); }}>Send</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {toast && <div className="toast">{toast}</div>}

      {view !== 'login' && view !== 'detail' && (
        <nav className="bottom-nav">
          <button onClick={() => setView('home')} className={`nav-item ${view === 'home' ? 'active' : ''}`}><div className="nav-icon-box"><Icon name="grid_view" /></div><span>HOME</span></button>
          <button onClick={() => setView('schedule')} className={`nav-item ${view === 'schedule' ? 'active' : ''}`}><div className="nav-icon-box"><Icon name="event_note" /></div><span>SCHEDULE</span></button>
          <button onClick={() => setView('alerts')} className={`nav-item ${view === 'alerts' ? 'active' : ''}`}><div className="nav-icon-box"><Icon name="notifications" /></div><span>ALERTS</span></button>
        </nav>
      )}
    </div>
  );
}
