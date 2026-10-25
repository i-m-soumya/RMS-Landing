import { useMemo, useState } from 'react';
import { postMarketing } from '../lib/marketingApi';

const toast = {
  success: (message) => window.alert(message),
  error: (message) => window.alert(message),
};

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Name is required.';
  if (!values.restaurantName.trim()) errors.restaurantName = 'Restaurant name is required.';
  if (!values.mobile || !/^\d{10}$/.test(values.mobile.replace(/\s/g, ''))) errors.mobile = 'Valid 10-digit mobile required.';
  if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Valid email required.';
  return errors;
}

export default function ContactForm({ contactContent }) {
  const [form, setForm] = useState({ name: '', restaurantName: '', mobile: '', email: '', message: '', website: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const inputClass = (field) =>
    `w-full h-11 px-4 bg-brand-muted rounded-xl text-sm outline-none border-2 transition-all placeholder:text-brand-sub/60 ${
      errors[field] && touched[field] ? 'border-brand-danger bg-red-50' : 'border-transparent focus:border-brand-accent focus:bg-white'
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

  const handleSubmit = async () => {
    const allTouched = Object.fromEntries(['name', 'restaurantName', 'mobile', 'email'].map((key) => [key, true]));
    setTouched(allTouched);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error(contactContent.toastError);
      return;
    }
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
      toast.success(contactContent.toastSuccess);
    } catch {
      toast.error('Unable to send your message right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fields = useMemo(() => [
    { key: 'name', type: 'text', placeholder: 'Your Name *' },
    { key: 'restaurantName', type: 'text', placeholder: 'Restaurant Name *' },
    { key: 'mobile', type: 'tel', placeholder: 'Mobile Number *', maxLength: 10 },
    { key: 'email', type: 'email', placeholder: 'Email Address *' },
  ], []);

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div>
        <div className="bg-brand-bg rounded-2xl p-6 mb-4">
          <h3 className="font-bold text-brand-text mb-4">Contact Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-accent/10 rounded-xl flex items-center justify-center">✉️</div>
              <div>
                <p className="text-xs text-brand-sub">Email</p>
                <a className="text-sm font-semibold text-brand-text underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent" href={`mailto:${contactContent.email}`}>{contactContent.email}</a>
              </div>
            </div>
            {contactContent.phone && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-accent/10 rounded-xl flex items-center justify-center">☎️</div>
              <div>
                <p className="text-xs text-brand-sub">Phone</p>
                <p className="text-sm font-semibold text-brand-text">{contactContent.phone}</p>
              </div>
            </div>
            )}
          </div>
        </div>
        <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-2xl p-4">
          <p className="text-sm text-brand-text font-medium mb-1">💬 Quick Response</p>
          <p className="text-xs text-brand-sub">{contactContent.quickResponse}</p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-brand-bg rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-4">✓</div>
          <h3 className="font-bold text-xl text-brand-text mb-2">{contactContent.successTitle}</h3>
          <p className="text-sm text-brand-sub mb-5">{contactContent.successText}</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ name: '', restaurantName: '', mobile: '', email: '', message: '', website: '' });
              setTouched({});
            }}
            className="h-10 px-5 bg-brand-accent text-white rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
            type="button"
          >
            {contactContent.successButton}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            {fields.slice(0, 2).map((field) => (
              <div key={field.key}>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  onBlur={() => blurField(field.key)}
                  placeholder={field.placeholder}
                  className={inputClass(field.key)}
                />
                {errors[field.key] && touched[field.key] && <p className="text-xs text-brand-danger mt-1">{errors[field.key]}</p>}
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {fields.slice(2).map((field) => (
              <div key={field.key}>
                <input
                  type={field.type}
                  value={form[field.key]}
                  maxLength={field.maxLength || undefined}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  onBlur={() => blurField(field.key)}
                  placeholder={field.placeholder}
                  className={inputClass(field.key)}
                />
                {errors[field.key] && touched[field.key] && <p className="text-xs text-brand-danger mt-1">{errors[field.key]}</p>}
              </div>
            ))}
          </div>

          <textarea
            value={form.message}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder="Tell us about your restaurant (optional)…"
            rows={4}
            className="w-full px-4 py-3 bg-brand-muted rounded-xl text-sm outline-none border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all resize-none placeholder:text-brand-sub/60"
          />

          <input
            type="text"
            value={form.website}
            onChange={(e) => updateField('website', e.target.value)}
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-px w-px opacity-0"
          />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-12 bg-brand-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-70"
            type="button"
          >
            {submitting ? contactContent.sending : contactContent.submitButton}
          </button>
        </div>
      )}
    </div>
  );
}
