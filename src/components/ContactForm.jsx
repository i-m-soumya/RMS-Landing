import { useMemo, useState } from 'react';
import { Facebook, Instagram, Mail, Phone, Youtube } from 'lucide-react';
import { postMarketing } from '../lib/marketingApi';

const socialProfiles = [
  { name: 'Facebook', key: 'facebook', Icon: Facebook },
  { name: 'Instagram', key: 'instagram', Icon: Instagram },
  { name: 'X', key: 'x', Icon: null },
  { name: 'YouTube', key: 'youtube', Icon: Youtube },
];

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Name is required.';
  if (!values.restaurantName.trim()) errors.restaurantName = 'Restaurant name is required.';
  if (!values.mobile || !/^\d{10}$/.test(values.mobile.replace(/\s/g, ''))) errors.mobile = 'Valid 10-digit mobile required.';
  if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Valid email required.';
  return errors;
}

function getSocialHref(value) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

export default function ContactForm({ contactContent, socialLinks = {} }) {
  const [form, setForm] = useState({ name: '', restaurantName: '', mobile: '', email: '', message: '', website: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const inputClass = (field) =>
    `h-11 w-full rounded-lg border bg-white px-3 text-sm text-brand-text outline-none transition-colors placeholder:text-slate-400 ${
      errors[field] && touched[field] ? 'border-brand-danger bg-red-50' : 'border-brand-border focus:border-brand-blue-strong focus:ring-2 focus:ring-blue-100'
    }`;

  const updateField = (field, value) => {
    const next = { ...form, [field]: value };
    setForm(next);
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate(next)[field] }));
    }
  };

  const blurField = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(form)[field] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const allTouched = Object.fromEntries(['name', 'restaurantName', 'mobile', 'email'].map((key) => [key, true]));
    setTouched(allTouched);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setSubmissionError('');
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitting(true);
    try {
      const response = await postMarketing('contact-queries', {
        name: form.name,
        restaurant_name: form.restaurantName,
        phone: form.mobile,
        email: form.email,
        message: form.message,
        website: form.website,
      });
      if (!response.ok) throw new Error('Contact submission failed');
      setSubmitted(true);
    } catch {
      setSubmissionError('Unable to send your message right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fields = useMemo(() => [
    { key: 'name', label: 'Your name', type: 'text', placeholder: 'Your Name *' },
    { key: 'restaurantName', label: 'Restaurant name', type: 'text', placeholder: 'Restaurant Name *' },
    { key: 'mobile', label: 'Mobile number', type: 'tel', placeholder: 'Mobile Number *', maxLength: 10 },
    { key: 'email', label: 'Email address', type: 'email', placeholder: 'Email Address *' },
  ], []);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-8">
      <div className="rounded-2xl border border-brand-border bg-brand-bg p-5 sm:p-6">
        <h3 className="mb-2 text-lg font-bold text-brand-text">Get in touch</h3>
        <p className="mb-5 text-sm leading-relaxed text-brand-sub">
          Tell us what your restaurant needs. We'll help you find the right setup.
        </p>
        <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-brand-blue-strong">
                <Mail size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-brand-sub">Email</p>
                <a className="break-all text-sm font-semibold text-brand-text underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent" href={`mailto:${contactContent.email}`}>{contactContent.email}</a>
              </div>
            </div>
            {contactContent.phone && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-brand-blue-strong">
                <Phone size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-brand-sub">Phone</p>
                <a className="text-sm font-semibold text-brand-text underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent" href={`tel:${contactContent.phone}`}>{contactContent.phone}</a>
              </div>
            </div>
            )}
        </div>
        <div className="mt-5 border-t border-brand-border pt-4">
          <p className="text-sm font-semibold text-brand-text">Need help getting started?</p>
          <p className="mt-1 text-sm leading-relaxed text-brand-sub">
            Talk to our team about product setup, a demo, or questions about running your restaurant.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {contactContent.phone && (
              <a
                href={`tel:${contactContent.phone}`}
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-brand-blue-strong px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-navy"
              >
                Call our team
              </a>
            )}
            {contactContent.email && (
              <a
                href={`mailto:${contactContent.email}`}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-brand-border bg-white px-4 text-sm font-semibold text-brand-navy transition-colors hover:bg-blue-50"
              >
                Email support
              </a>
            )}
          </div>
        </div>
        <nav className="mt-4 flex items-center gap-2" aria-label="Restro360 social media">
          {socialProfiles.map(({ name, key, Icon }) => {
            const href = getSocialHref(socialLinks[key]);
            const className = 'flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border bg-white text-brand-navy transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue';
            const icon = Icon ? <Icon size={18} aria-hidden="true" /> : <span aria-hidden="true" className="text-lg font-semibold">X</span>;

            return href ? (
              <a key={key} href={href} target="_blank" rel="noreferrer" aria-label={`Restro360 on ${name}`} title={`Restro360 on ${name}`} className={`${className} hover:border-brand-blue hover:bg-blue-50 hover:text-brand-blue-strong`}>
                {icon}
              </a>
            ) : (
              <span key={key} role="img" aria-label={`${name} profile link not configured`} title={`${name} profile link not configured`} className={`${className} cursor-not-allowed text-slate-600`}>
                {icon}
              </span>
            );
          })}
        </nav>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-border bg-white p-6 text-center" role="status" aria-live="polite">
          <div className="w-16 h-16 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-4">✓</div>
          <h3 className="font-bold text-xl text-brand-text mb-2">{contactContent.successTitle}</h3>
          <p className="text-sm text-brand-sub mb-5">{contactContent.successText}</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ name: '', restaurantName: '', mobile: '', email: '', message: '', website: '' });
              setTouched({});
              setSubmissionError('');
            }}
            className="h-10 px-5 bg-brand-accent text-white rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
            type="button"
          >
            {contactContent.successButton}
          </button>
        </div>
      ) : (
        <form className="space-y-3 rounded-2xl border border-brand-border bg-white p-5 sm:p-6" onSubmit={handleSubmit} noValidate aria-busy={submitting}>
          <div className="mb-1">
            <h3 className="text-lg font-bold text-brand-text">Send us a message</h3>
            <p className="mt-1 text-sm text-brand-sub">Share a few details and we'll get back to you.</p>
          </div>
          {submissionError ? <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">{submissionError}</p> : null}
          <div className="grid sm:grid-cols-2 gap-3">
            {fields.slice(0, 2).map((field) => (
              <div key={field.key}>
                <label className="mb-1 block text-sm font-medium text-brand-text" htmlFor={field.key}>
                  {field.label} <span aria-hidden="true">*</span><span className="sr-only"> required</span>
                </label>
                <input
                  id={field.key}
                  name={field.key}
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  onBlur={() => blurField(field.key)}
                  placeholder={field.placeholder}
                  className={inputClass(field.key)}
                  required
                  aria-invalid={Boolean(errors[field.key] && touched[field.key])}
                  aria-describedby={errors[field.key] && touched[field.key] ? `${field.key}-error` : undefined}
                />
                {errors[field.key] && touched[field.key] && <p id={`${field.key}-error`} className="text-sm text-brand-danger mt-1">{errors[field.key]}</p>}
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {fields.slice(2).map((field) => (
              <div key={field.key}>
                <label className="mb-1 block text-sm font-medium text-brand-text" htmlFor={field.key}>
                  {field.label} <span aria-hidden="true">*</span><span className="sr-only"> required</span>
                </label>
                <input
                  id={field.key}
                  name={field.key}
                  type={field.type}
                  value={form[field.key]}
                  maxLength={field.maxLength || undefined}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  onBlur={() => blurField(field.key)}
                  placeholder={field.placeholder}
                  className={inputClass(field.key)}
                  required
                  aria-invalid={Boolean(errors[field.key] && touched[field.key])}
                  aria-describedby={errors[field.key] && touched[field.key] ? `${field.key}-error` : undefined}
                />
                {errors[field.key] && touched[field.key] && <p id={`${field.key}-error`} className="text-sm text-brand-danger mt-1">{errors[field.key]}</p>}
              </div>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-brand-text" htmlFor="contact-message">Tell us about your restaurant (optional)</label>
            <textarea
              id="contact-message"
              name="message"
              value={form.message}
              onChange={(e) => updateField('message', e.target.value)}
              placeholder="Tell us about your restaurant (optional)…"
              rows={4}
              className="min-h-28 w-full resize-y rounded-lg border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-text outline-none transition-colors placeholder:text-slate-400 focus:border-brand-blue-strong focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <input
            name="website"
            type="text"
            value={form.website}
            onChange={(e) => updateField('website', e.target.value)}
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-px w-px opacity-0"
          />

          <button
            disabled={submitting}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-blue-strong px-4 font-semibold text-white transition-colors hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            aria-disabled={submitting}
          >
            {submitting ? contactContent.sending : contactContent.submitButton}
          </button>
          </form>
      )}
    </div>
  );
}
