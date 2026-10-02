import { useState } from 'react';
import { Send, CheckCircle, Mail, Phone } from 'lucide-react';
import { siteContent } from '../src/content/siteContent';

const toast = {
  success: (message: string) => window.alert(message),
  error: (message: string) => window.alert(message),
};

const contactEmail = siteContent.contact.email;
const contactPhone = siteContent.contact.phone;

interface FormData { name: string; restaurantName: string; mobile: string; email: string; message: string; }
interface FormErrors { name?: string; restaurantName?: string; mobile?: string; email?: string; message?: string; }

function validate(d: FormData): FormErrors {
  const e: FormErrors = {};
  if (!d.name.trim()) e.name = 'Name is required.';
  if (!d.restaurantName.trim()) e.restaurantName = 'Restaurant name is required.';
  if (!d.mobile || !/^\d{10}$/.test(d.mobile.replace(/\s/g, ''))) e.mobile = 'Valid 10-digit mobile required.';
  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = 'Valid email required.';
  return e;
}

export default function ContactSection() {
  const [form, setForm] = useState<FormData>({ name: '', restaurantName: '', mobile: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validate({ ...form, [field]: value })[field] }));
  };

  const blur = (field: keyof FormData) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validate(form)[field] }));
  };

  const handleSubmit = async () => {
    const allTouched = Object.fromEntries(['name', 'restaurantName', 'mobile', 'email'].map(k => [k, true]));
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) { toast.error('Please fix the errors before submitting.'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Message sent! We'll be in touch within 24 hours.");
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full h-11 px-4 bg-brand-muted rounded-xl text-sm outline-none border-2 transition-all placeholder:text-brand-sub/60 ${
      errors[field] && touched[field] ? 'border-brand-danger bg-red-50' : 'border-transparent focus:border-brand-accent focus:bg-white'
    }`;

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-brand-text mb-3">{siteContent.sections.contact.heading}</h2>
          <p className="text-brand-sub max-w-md mx-auto">
            {siteContent.sections.contact.subheading}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Contact Info */}
          <div>
            <div className="bg-brand-bg rounded-2xl p-6 mb-4">
              <h3 className="font-bold text-brand-text mb-4">Contact Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                    <Mail size={16} className="text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-sub">Email</p>
                    <p className="text-sm font-semibold text-brand-text">{contactEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                    <Phone size={16} className="text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-brand-sub">Phone</p>
                    <p className="text-sm font-semibold text-brand-text">{contactPhone}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-2xl p-4">
              <p className="text-sm text-brand-text font-medium mb-1">💬 Quick Response</p>
              <p className="text-xs text-brand-sub">{siteContent.contact.quickResponse}</p>
            </div>
          </div>

          {/* Form */}
          {submitted ? (
            <div className="bg-brand-bg rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-brand-success" />
              </div>
              <h3 className="font-bold text-xl text-brand-text mb-2">{siteContent.contact.successTitle}</h3>
              <p className="text-sm text-brand-sub mb-5">{siteContent.contact.successText}</p>
              <button onClick={() => { setSubmitted(false); setForm({ name: '', restaurantName: '', mobile: '', email: '', message: '' }); setTouched({}); }}
                className="h-10 px-5 bg-brand-accent text-white rounded-xl text-sm font-semibold hover:brightness-110 transition-all">
                {siteContent.contact.successButton}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Name + Restaurant */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <input type="text" value={form.name} onChange={e => set('name', e.target.value)} onBlur={() => blur('name')} placeholder="Your Name *" className={inputClass('name')} />
                  {errors.name && touched.name && <p className="text-xs text-brand-danger mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input type="text" value={form.restaurantName} onChange={e => set('restaurantName', e.target.value)} onBlur={() => blur('restaurantName')} placeholder="Restaurant Name *" className={inputClass('restaurantName')} />
                  {errors.restaurantName && touched.restaurantName && <p className="text-xs text-brand-danger mt-1">{errors.restaurantName}</p>}
                </div>
              </div>

              {/* Mobile + Email */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <input type="tel" value={form.mobile} onChange={e => set('mobile', e.target.value)} onBlur={() => blur('mobile')} placeholder="Mobile Number *" maxLength={10} className={inputClass('mobile')} />
                  {errors.mobile && touched.mobile && <p className="text-xs text-brand-danger mt-1">{errors.mobile}</p>}
                </div>
                <div>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} onBlur={() => blur('email')} placeholder="Email Address *" className={inputClass('email')} />
                  {errors.email && touched.email && <p className="text-xs text-brand-danger mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Message */}
              <textarea value={form.message} onChange={e => set('message', e.target.value)} placeholder="Tell us about your restaurant (optional)…" rows={4}
                className="w-full px-4 py-3 bg-brand-muted rounded-xl text-sm outline-none border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all resize-none placeholder:text-brand-sub/60" />

              <button onClick={handleSubmit} disabled={submitting}
                className="w-full h-12 bg-brand-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-70">
                {submitting ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{siteContent.contact.sending}</> : <><Send size={16} />{siteContent.contact.submitButton}</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
