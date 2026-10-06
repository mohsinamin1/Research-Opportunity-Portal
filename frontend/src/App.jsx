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

  const handleSelect = async (opportunity) => {
    try {
      const details = await getOpportunity(opportunity.id);
      setSelected(details);
    } catch {
      setSelected(opportunity);
    }
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
      setSelected(saved);
      setForm(emptyForm);
      setEditingId(null);
      await loadOpportunities();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const beginEdit = (opportunity) => {
    setEditingId(opportunity.id);
    setForm({
      ...opportunity,
      application_deadline: opportunity.application_deadline.slice(0, 10)
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
          <div className="section-heading"><h2>Available opportunities</h2><span>{opportunities.length} total</span></div>
          {loading ? <p>Loading opportunities...</p> : opportunities.length === 0 ? <p>No opportunities posted yet.</p> : (
            <div className="opportunity-list">
              {opportunities.map((opportunity) => (
                <article className={`opportunity ${selected?.id === opportunity.id ? 'selected' : ''}`} key={opportunity.id}>
                  <button className="opportunity-main" onClick={() => handleSelect(opportunity)}>
                    <span className="status">{opportunity.status}</span>
                    <h3>{opportunity.title}</h3>
                    <p>{opportunity.research_area} · {opportunity.department}</p>
                    <small>Deadline: {new Date(opportunity.application_deadline).toLocaleDateString()}</small>
                  </button>
                  <div className="item-actions">
                    <button onClick={() => beginEdit(opportunity)}>Edit</button>
                    {opportunity.status === 'Open' && <button onClick={() => closeOpportunity(opportunity)}>Close</button>}
                    <button className="danger" onClick={() => removeOpportunity(opportunity.id)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      {selected && <section className="card details">
        <div className="section-heading"><h2>{selected.title}</h2><span className="status">{selected.status}</span></div>
        <p>{selected.description}</p>
        <div className="details-grid">
          <p><strong>Faculty:</strong> {selected.faculty_name}</p><p><strong>Department:</strong> {selected.department}</p>
          <p><strong>Area:</strong> {selected.research_area}</p><p><strong>Skills:</strong> {selected.required_skills}</p>
          <p><strong>Positions:</strong> {selected.available_positions}</p><p><strong>Deadline:</strong> {new Date(selected.application_deadline).toLocaleDateString()}</p>
        </div>
      </section>}
    </main>
  );
}

export default App;
