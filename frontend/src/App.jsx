import { useEffect, useState } from 'react';
import { createOpportunity, deleteOpportunity, getOpportunities, getOpportunity, updateOpportunity } from './api.js';

const emptyForm = {
  title: '',
  description: '',
  research_area: '',
  faculty_name: '',
  department: '',
  required_skills: '',
  available_positions: 1,
  application_deadline: '',
  status: 'Open'
};

function App() {
  const [opportunities, setOpportunities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState('portal'); // 'portal' | 'detail'
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  const loadOpportunities = async () => {
    try {
      setOpportunities(await getOpportunities());
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleViewOpportunity = async (opportunity) => {
    try {
      // Retrieve the single opportunity directly from the database via REST API
      const fullDetails = await getOpportunity(opportunity.id);
      setSelected(fullDetails);
      setViewMode('detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleBack = () => {
    setViewMode('portal');
    setSelected(null);
  };

  useEffect(() => { loadOpportunities(); }, []);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const saved = editingId
        ? await updateOpportunity(editingId, form)
        : await createOpportunity({ ...form, available_positions: Number(form.available_positions) });
      setMessage({ type: 'success', text: editingId ? 'Opportunity updated successfully.' : 'Opportunity created successfully.' });
      setForm(emptyForm);
      setEditingId(null);
      await loadOpportunities();
      if (viewMode === 'detail' && selected?.id === saved.id) {
        setSelected(saved);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const beginEdit = (opportunity) => {
    setViewMode('portal');
    setEditingId(opportunity.id);
    setForm({
      ...opportunity,
      application_deadline: opportunity.application_deadline ? opportunity.application_deadline.slice(0, 10) : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeOpportunity = async (opportunity) => {
    try {
      const updated = await updateOpportunity(opportunity.id, { ...opportunity, status: 'Closed' });
      setSelected(updated);
      setMessage({ type: 'success', text: 'Opportunity marked as closed.' });
      await loadOpportunities();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const removeOpportunity = async (id) => {
    if (!window.confirm('Delete this opportunity?')) return;
    try {
      await deleteOpportunity(id);
      setSelected(null);
      setViewMode('portal');
      setMessage({ type: 'success', text: 'Opportunity deleted successfully.' });
      await loadOpportunities();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">University research hub</p>
        <h1>Research Opportunity Portal</h1>
        <p>Manage research openings in one simple place.</p>
      </header>

      {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

      {viewMode === 'detail' && selected ? (
        <article className="card fullpage-card">
          <div className="fullpage-topbar">
            <button type="button" className="secondary back-btn" onClick={handleBack}>
              ← Back to all opportunities
            </button>
            <span className={`status ${selected.status === 'Closed' ? 'closed' : ''}`}>
              Status: {selected.status}
            </span>
          </div>

          <div className="fullpage-header">
            <div>
              <span className="opp-id-pill">Opportunity #{selected.id}</span>
              <h2 className="fullpage-title">{selected.title}</h2>
            </div>
            <div className="fullpage-actions">
              <button type="button" onClick={() => beginEdit(selected)}>Edit opportunity</button>
              {selected.status === 'Open' && (
                <button type="button" className="secondary" onClick={() => closeOpportunity(selected)}>
                  Close opportunity
                </button>
              )}
              <button type="button" className="danger" onClick={() => removeOpportunity(selected.id)}>
                Delete opportunity
              </button>
            </div>
          </div>

          <hr className="divider" />

          <section className="fullpage-section">
            <h3>Opportunity Information</h3>
            <div className="details-grid-full">
              <div className="detail-item">
                <span className="detail-label">Research Area</span>
                <span className="detail-value">{selected.research_area}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Faculty Member</span>
                <span className="detail-value">{selected.faculty_name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Department</span>
                <span className="detail-value">{selected.department}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Available Positions</span>
                <span className="detail-value">{selected.available_positions}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Application Deadline</span>
                <span className="detail-value">
                  {selected.application_deadline ? new Date(selected.application_deadline).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Required Skills</span>
                <span className="detail-value">{selected.required_skills}</span>
              </div>
            </div>
          </section>

          <section className="fullpage-section">
            <h3>Research Description</h3>
            <div className="description-box">
              <p>{selected.description}</p>
            </div>
          </section>
        </article>
      ) : (
        <section className="layout">
          <form className="card form-card" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Update opportunity' : 'Post an opportunity'}</h2>
            <div className="form-grid">
              <label>Research title<input name="title" value={form.title} onChange={handleChange} required /></label>
              <label>Research area<input name="research_area" value={form.research_area} onChange={handleChange} required /></label>
              <label>Faculty member<input name="faculty_name" value={form.faculty_name} onChange={handleChange} required /></label>
              <label>Department<input name="department" value={form.department} onChange={handleChange} required /></label>
              <label>Available positions<input name="available_positions" type="number" min="1" value={form.available_positions} onChange={handleChange} required /></label>
              <label>Application deadline<input name="application_deadline" type="date" value={form.application_deadline} onChange={handleChange} required /></label>
            </div>
            <label>Required skills<input name="required_skills" value={form.required_skills} onChange={handleChange} placeholder="e.g. Python, data analysis" required /></label>
            <label>Description<textarea name="description" rows="4" value={form.description} onChange={handleChange} required /></label>
            <label>Status<select name="status" value={form.status} onChange={handleChange}><option>Open</option><option>Closed</option></select></label>
            <div className="form-actions">
              <button type="submit">{editingId ? 'Save changes' : 'Create opportunity'}</button>
              {editingId && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
            </div>
          </form>

          <section className="card list-card">
            <div className="section-heading">
              <h2>Available opportunities</h2>
              <span>{opportunities.length} total</span>
            </div>
            {loading ? <p>Loading opportunities...</p> : opportunities.length === 0 ? <p>No opportunities posted yet.</p> : (
              <div className="opportunity-title-list">
                {opportunities.map((opportunity) => (
                  <article className="opportunity-title-card" key={opportunity.id}>
                    <button
                      type="button"
                      className="opportunity-title-btn"
                      onClick={() => handleViewOpportunity(opportunity)}
                    >
                      <span className="opp-bullet">📌</span>
                      <span className="opp-single-title">{opportunity.title}</span>
                      <span className="view-pill">View details →</span>
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      )}
    </main>
  );
}

export default App;
