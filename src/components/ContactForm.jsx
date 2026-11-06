import { useState } from 'react';

const initialForm = {
  name: '',
  restaurantName: '',
  mobile: '',
  email: '',
  message: '',
  website: '',
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Enter your name.';
  if (!form.restaurantName.trim()) errors.restaurantName = 'Enter your restaurant name.';
  if (!/^\d{10}$/.test(form.mobile.replace(/\s/g, ''))) errors.mobile = 'Enter a valid 10-digit phone number.';
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  return errors;
}

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const update = (field, value) => {
    const next = { ...form, [field]: value };
    setForm(next);
    if (errors[field]) setErrors(validate(next));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 350);
  };

  if (submitted) {
    return (
      <div className="contact-form contact-success" role="status" aria-live="polite">
        <h3>Enquiry form preview</h3>
        <p className="form-status">This is a form preview. No message was sent. For a real enquiry, email <a href="mailto:support@restro360.tech">support@restro360.tech</a>.</p>
        <button className="button button-secondary" type="button" onClick={() => { setSubmitted(false); setForm(initialForm); }}>
          Send another message
        </button>
      </div>
    );
  }

  const fields = [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'restaurantName', label: 'Restaurant name', type: 'text', required: true },
    { key: 'mobile', label: 'Phone', type: 'tel', required: true, maxLength: 10 },
    { key: 'email', label: 'Email (optional)', type: 'email', required: false },
  ];

  return (
    <form className="contact-form" onSubmit={submit} noValidate aria-busy={submitting}>
      <h3>Send us a message</h3>
      <div className="form-grid">
        {fields.map(({ key, label, type, required, maxLength }) => (
          <label key={key} htmlFor={`contact-${key}`}>
            {label}{required ? ' *' : ''}
            <input
              id={`contact-${key}`}
              name={key}
              type={type}
              value={form[key]}
              maxLength={maxLength}
              required={required}
              inputMode={key === 'mobile' ? 'numeric' : undefined}
              autoComplete={key === 'name' ? 'name' : key === 'mobile' ? 'tel' : key === 'email' ? 'email' : 'organization'}
              aria-invalid={Boolean(errors[key])}
              aria-describedby={errors[key] ? `contact-${key}-error` : undefined}
              onChange={(event) => update(key, event.target.value)}
            />
            {errors[key] && <span className="field-error" id={`contact-${key}-error`}>{errors[key]}</span>}
          </label>
        ))}
      </div>
      <label htmlFor="contact-message">
        Message
        <textarea id="contact-message" name="message" value={form.message} onChange={(event) => update('message', event.target.value)} />
      </label>
      <input
        name="website"
        type="text"
        value={form.website}
        onChange={(event) => update('website', event.target.value)}
        tabIndex="-1"
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px' }}
      />
      <button className="button button-primary" type="submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send message'}
      </button>
      <p className="form-status" aria-live="polite">{submitting ? 'Sending your message…' : ''}</p>
    </form>
  );
}
