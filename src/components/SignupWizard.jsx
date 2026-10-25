import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { siteConfig, pricingConfig } from '../lib/siteConfig';

const apiRoot = `${siteConfig.apiBaseUrl.replace(/\/$/, '')}/api`;
const stepOrder = ['email_otp', 'mobile_otp', 'password', 'trial', 'done'];
const stepLabels = ['Your details', 'Email', 'Mobile', 'Password', 'Free trial'];
const signupTokenKey = 'restro360-signup-token';
const attributionKey = 'restro360-signup-attribution';

function apiErrorMessage(error) {
  if (error.code === 'ACCOUNT_EXISTS') return 'You already have an account. Log in to continue.';
  if (error.code === 'OTP_INVALID') return 'That code did not match. Check it and try again.';
  if (error.code === 'OTP_EXPIRED') return 'That code has expired. Request a new one.';
  if (error.code === 'OTP_ATTEMPTS_EXCEEDED') return 'Too many incorrect codes. Request a new code to continue.';
  if (error.code === 'RESEND_COOLDOWN' || error.code === 'RATE_LIMITED') {
    return `Please wait ${error.retryAfter || 30} seconds before trying again.`;
  }
  if (error.code === 'PAYMENT_FAILED') return 'Trial confirmation did not complete. You can retry without repeating verification.';
  return error.message || 'Something went wrong. Please try again.';
}

function estimateTrialEnd() {
  const date = new Date();
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + pricingConfig.trialMonths);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, lastDay));
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function storeFirstVisitAttribution() {
  if (sessionStorage.getItem(attributionKey)) return;
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  sessionStorage.setItem(attributionKey, JSON.stringify({ utm, referrer: document.referrer || '' }));
}

function PrimaryButton({ children, disabled, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="min-h-12 w-full rounded-xl bg-brand-accent px-5 py-3 font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export default function SignupWizard() {
  const [plan, setPlan] = useState(null);
  const [step, setStep] = useState('details');
  const [token, setToken] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [maskedMobile, setMaskedMobile] = useState('');
  const [form, setForm] = useState({ ownerName: '', restaurantName: '', email: '', mobile: '', consent: false, hp: '' });
  const [autopayConsent, setAutopayConsent] = useState(false);
  const [code, setCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [trialEnd, setTrialEnd] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const codeRefs = useRef([]);

  const activeStep = stepOrder.indexOf(step);
  const mobileChannel = step === 'mobile_otp';
  const expectedCodeLength = mobileChannel ? 4 : 6;
  const trialEndEstimate = useMemo(estimateTrialEnd, []);
  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const apiRequest = useCallback(async (path, { method = 'GET', body } = {}) => {
    let response;
    try {
      response = await fetch(`${apiRoot}${path}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw Object.assign(new Error('We could not reach the signup service. Check your connection and retry.'), { code: 'NETWORK_ERROR' });
    }
    let payload;
    try {
      payload = await response.json();
    } catch {
      payload = {};
    }
    if (!response.ok) {
      const apiError = payload.error || {};
      throw Object.assign(new Error(apiError.message || `Request failed (${response.status}).`), {
        code: apiError.code || 'REQUEST_FAILED',
        retryAfter: apiError.retryAfter,
        status: response.status,
      });
    }
    return payload;
  }, []);

  const rememberToken = useCallback((value) => {
    sessionStorage.setItem(signupTokenKey, value);
    setToken(value);
  }, []);

  const sendOtp = useCallback(async (signupToken, channel) => {
    setLoading(true);
    setError('');
    setErrorCode('');
    try {
      const result = await apiRequest(`/signup/${signupToken}/${channel}-otp/send`, { method: 'POST', body: {} });
      setOtpSent(true);
      setCode('');
      setResendIn(result.resendIn || pricingConfig.otpResendSeconds || 30);
      return true;
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
      setErrorCode(requestError.code);
      if (requestError.retryAfter) setResendIn(requestError.retryAfter);
      return false;
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    let active = true;
    storeFirstVisitAttribution();
    const load = async () => {
      try {
        const currentPlan = await apiRequest('/signup/plan');
        if (active) setPlan(currentPlan);
      } catch (requestError) {
        if (active) {
          setError(apiErrorMessage(requestError));
          setErrorCode(requestError.code);
        }
      }

      const queryToken = new URLSearchParams(window.location.search).get('t');
      const storedToken = queryToken || sessionStorage.getItem(signupTokenKey);
      if (!storedToken) return;
      try {
        const status = await apiRequest(`/signup/${storedToken}/status`);
        if (!active) return;
        rememberToken(storedToken);
        setStep(status.step);
        setMaskedEmail(status.emailMasked || '');
        setMaskedMobile(status.mobileMasked || '');
        setOtpSent(false);
        if (status.step === 'done') {
          setRedirectUrl(sessionStorage.getItem(`restro360-redirect-${storedToken}`) || `${siteConfig.consoleUrl}/login`);
        }
      } catch (requestError) {
        sessionStorage.removeItem(signupTokenKey);
        if (active) {
          setError(requestError.code === 'SIGNUP_NOT_FOUND'
            ? 'Your saved signup expired. Please enter your details again.'
            : apiErrorMessage(requestError));
          setErrorCode(requestError.code);
          setToken('');
          setStep('details');
        }
      }
    };
    void load();
    return () => { active = false; };
  }, [apiRequest, rememberToken]);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = window.setInterval(() => setResendIn((remaining) => Math.max(0, remaining - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendIn > 0]);

  useEffect(() => {
    if (otpSent) codeRefs.current[0]?.focus();
  }, [otpSent, mobileChannel]);

  useEffect(() => {
    if (step !== 'done' || !redirectUrl) return undefined;
    const timer = window.setTimeout(() => window.location.assign(redirectUrl), 1400);
    return () => window.clearTimeout(timer);
  }, [redirectUrl, step]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: '' }));
  };

  const captureAttribution = () => {
    storeFirstVisitAttribution();
    const saved = sessionStorage.getItem(attributionKey);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* use current visit details */ }
    }
    const params = new URLSearchParams(window.location.search);
    const utm = {};
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
      const value = params.get(key);
      if (value) utm[key] = value;
    }
    const attribution = { utm, referrer: document.referrer || '' };
    sessionStorage.setItem(attributionKey, JSON.stringify(attribution));
    return attribution;
  };

  const startSignup = async (event) => {
    event.preventDefault();
    const errors = {};
    if (form.ownerName.trim().length < 2) errors.ownerName = 'Enter your name.';
    if (form.restaurantName.trim().length < 2) errors.restaurantName = 'Enter your restaurant name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email address.';
    if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, '').replace(/^91/, '').slice(-10))) errors.mobile = 'Enter a 10-digit Indian mobile number.';
    if (!form.consent) errors.consent = 'Consent is required to continue.';
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setLoading(true);
    setError('');
    setErrorCode('');
    try {
      const attribution = captureAttribution();
      const result = await apiRequest('/signup/start', {
        method: 'POST',
        body: {
          ownerName: form.ownerName.trim(),
          restaurantName: form.restaurantName.trim(),
          email: form.email.trim(),
          mobile: form.mobile.replace(/\D/g, '').replace(/^91/, '').slice(-10),
          consent: true,
          policyVersion: siteConfig.policyVersion,
          utm: attribution.utm || {},
          referrer: attribution.referrer || '',
          hp: form.hp,
        },
      });
      rememberToken(result.token);
      setStep(result.step);
      setMaskedEmail(form.email.trim());
      setMaskedMobile(form.mobile);
      setOtpSent(false);
      if (result.step === 'email_otp' || result.step === 'mobile_otp') {
        await sendOtp(result.token, result.step === 'email_otp' ? 'email' : 'mobile');
      }
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
      setErrorCode(requestError.code);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    if (code.length !== expectedCodeLength) {
      setError(`Enter the ${expectedCodeLength}-digit code.`);
      return;
    }
    setLoading(true);
    setError('');
    setErrorCode('');
    try {
      const channel = mobileChannel ? 'mobile' : 'email';
      const result = await apiRequest(`/signup/${token}/${channel}-otp/verify`, {
        method: 'POST',
        body: { code },
      });
      setStep(result.step);
      setCode('');
      setOtpSent(false);
      setResendIn(0);
      if (result.step === 'mobile_otp') setMaskedMobile(form.mobile);
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
      setErrorCode(requestError.code);
      if (requestError.retryAfter) setResendIn(requestError.retryAfter);
    } finally {
      setLoading(false);
    }
  };

  const changeEmail = () => {
    sessionStorage.removeItem(signupTokenKey);
    setToken('');
    setStep('details');
    setOtpSent(false);
    setCode('');
    setResendIn(0);
    setError('');
    setErrorCode('');
  };

  const savePassword = async (event) => {
    event.preventDefault();
    if (password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await apiRequest(`/signup/${token}/password`, { method: 'POST', body: { password } });
      setStep(result.step);
      setPassword('');
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
      setErrorCode(requestError.code);
    } finally {
      setLoading(false);
    }
  };

  const confirmTrial = async (simulate) => {
    if (!autopayConsent) {
      setError('Please consent to the recurring payment terms to continue.');
      return;
    }
    setLoading(true);
    setError('');
    setErrorCode('');
    try {
      const keyName = `restro360-idempotency-${token}`;
      let idempotencyKey = sessionStorage.getItem(keyName);
      if (!idempotencyKey) {
        idempotencyKey = window.crypto.randomUUID();
        sessionStorage.setItem(keyName, idempotencyKey);
      }
      const result = await apiRequest(`/signup/${token}/trial/confirm`, {
        method: 'POST',
        body: { autopayConsent: true, idempotencyKey, ...(simulate ? { simulate } : {}) },
      });
      sessionStorage.setItem(`restro360-redirect-${token}`, result.redirectUrl);
      setTrialEnd(result.trialEnd);
      setRedirectUrl(result.redirectUrl);
      setStep('done');
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
      setErrorCode(requestError.code);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 1) {
      const pasted = digits.slice(0, expectedCodeLength);
      setCode(pasted);
      const next = Math.min(pasted.length, expectedCodeLength - 1);
      codeRefs.current[next]?.focus();
      return;
    }
    const chars = code.padEnd(expectedCodeLength, ' ').split('');
    chars[index] = digits || ' ';
    const nextCode = chars.join('').replace(/\s+$/, '');
    setCode(nextCode);
    if (digits && index < expectedCodeLength - 1) codeRefs.current[index + 1]?.focus();
  };

  const showAccountLink = errorCode === 'ACCOUNT_EXISTS';
  const consoleLoginUrl = `${siteConfig.consoleUrl.replace(/\/$/, '')}/login`;

  return (
    <main className="min-h-screen bg-brand-bg px-4 py-8 text-brand-text sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="inline-flex rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent">
          <span className="font-display text-xl font-bold text-brand-accent">Restro360</span>
        </a>
        <div className="mt-8 rounded-3xl border border-brand-border bg-white p-5 shadow-lg sm:p-9">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{pricingConfig.primaryCta}</h1>
          <p className="mt-2 text-sm leading-6 text-brand-sub">
            Then ₹{pricingConfig.standardPriceInr}/month, {pricingConfig.gstText}. {pricingConfig.cancelAnyTime}.
          </p>

          {step !== 'details' && step !== 'done' && (
            <ol aria-label="Signup progress" className="mt-7 grid grid-cols-5 gap-1">
              {stepLabels.map((label, index) => {
                const current = index === activeStep;
                const complete = index < activeStep;
                return (
                  <li key={label} className="text-center">
                    <div className={`mx-auto mb-2 grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${complete ? 'bg-brand-accent text-white' : current ? 'border-2 border-brand-accent text-brand-accent' : 'bg-brand-muted text-brand-sub'}`}>
                      {complete ? '✓' : index + 1}
                    </div>
                    <span className={`hidden text-[11px] sm:block ${current ? 'font-semibold text-brand-text' : 'text-brand-sub'}`}>{label}</span>
                  </li>
                );
              })}
            </ol>
          )}

          {error && (
            <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <p>{error}</p>
              {showAccountLink && <a className="mt-2 inline-block font-semibold underline" href={consoleLoginUrl}>Log in to your account</a>}
              {(errorCode === 'PAYMENT_FAILED' || errorCode === 'NETWORK_ERROR') && (
                <a className="mt-2 inline-block font-semibold underline" href={`mailto:${siteConfig.supportEmail}`}>Contact support</a>
              )}
              {step === 'trial' && errorCode && !['PAYMENT_FAILED', 'NETWORK_ERROR'].includes(errorCode) && (
                <a className="mt-2 inline-block font-semibold underline" href={`mailto:${siteConfig.supportEmail}`}>Contact support</a>
              )}
            </div>
          )}

          {step === 'details' && (
            <form className="mt-7 space-y-4" onSubmit={startSignup} noValidate>
              <div>
                <label htmlFor="owner-name" className="mb-1 block text-sm font-medium">Your name</label>
                <input id="owner-name" autoComplete="name" value={form.ownerName} onChange={(event) => updateForm('ownerName', event.target.value)} className="w-full rounded-xl border border-brand-border px-4 py-3 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" required />
                {fieldErrors.ownerName && <p className="mt-1 text-sm text-red-700">{fieldErrors.ownerName}</p>}
              </div>
              <div>
                <label htmlFor="restaurant-name" className="mb-1 block text-sm font-medium">Restaurant name</label>
                <input id="restaurant-name" autoComplete="organization" value={form.restaurantName} onChange={(event) => updateForm('restaurantName', event.target.value)} className="w-full rounded-xl border border-brand-border px-4 py-3 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" required />
                {fieldErrors.restaurantName && <p className="mt-1 text-sm text-red-700">{fieldErrors.restaurantName}</p>}
              </div>
              <div>
                <label htmlFor="signup-email" className="mb-1 block text-sm font-medium">Email address</label>
                <input id="signup-email" type="email" autoComplete="email" inputMode="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} className="w-full rounded-xl border border-brand-border px-4 py-3 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" required />
                {fieldErrors.email && <p className="mt-1 text-sm text-red-700">{fieldErrors.email}</p>}
              </div>
              <div>
                <label htmlFor="signup-mobile" className="mb-1 block text-sm font-medium">Mobile number</label>
                <div className="flex rounded-xl border border-brand-border focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-accent/20">
                  <span className="flex items-center border-r border-brand-border px-3 text-sm text-brand-sub">+91</span>
                  <input id="signup-mobile" type="tel" autoComplete="tel-national" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" value={form.mobile} onChange={(event) => updateForm('mobile', event.target.value.replace(/\D/g, '').slice(0, 10))} className="min-w-0 flex-1 rounded-r-xl px-4 py-3 outline-none" required />
                </div>
                {fieldErrors.mobile && <p className="mt-1 text-sm text-red-700">{fieldErrors.mobile}</p>}
              </div>
              <label className="flex items-start gap-3 text-sm leading-5">
                <input type="checkbox" checked={form.consent} onChange={(event) => updateForm('consent', event.target.checked)} className="mt-1 h-4 w-4 accent-brand-accent" />
                <span>I agree to the <a className="font-semibold underline" href="/terms-and-conditions" target="_blank" rel="noreferrer">Terms</a> and acknowledge the <a className="font-semibold underline" href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a>.</span>
              </label>
              {fieldErrors.consent && <p className="text-sm text-red-700">{fieldErrors.consent}</p>}
              <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
                <label htmlFor="signup-hp">Leave this field empty</label>
                <input id="signup-hp" name="hp" tabIndex={-1} autoComplete="off" value={form.hp} onChange={(event) => updateForm('hp', event.target.value)} />
              </div>
              <PrimaryButton type="submit" disabled={loading}>{loading ? 'Starting…' : 'Continue'}</PrimaryButton>
            </form>
          )}

          {(step === 'email_otp' || step === 'mobile_otp') && (
            <form className="mt-7 space-y-5" onSubmit={verifyCode}>
              <div>
                <h2 className="text-xl font-semibold">{mobileChannel ? 'Verify your mobile' : 'Verify your email'}</h2>
                <p className="mt-2 text-sm leading-6 text-brand-sub">
                  {mobileChannel ? `Enter the code for ${maskedMobile || 'your mobile number'}.` : `Enter the code sent to ${maskedEmail || 'your email address'}.`}
                </p>
              </div>
              {!otpSent ? (
                <PrimaryButton disabled={loading} onClick={() => void sendOtp(token, mobileChannel ? 'mobile' : 'email')}>
                  {loading ? 'Sending…' : 'Send verification code'}
                </PrimaryButton>
              ) : (
                <>
                  <div className="flex justify-between gap-2" role="group" aria-label={`${mobileChannel ? 'Mobile' : 'Email'} verification code`}>
                    {Array.from({ length: expectedCodeLength }, (_, index) => (
                      <input
                        key={index}
                        ref={(element) => { codeRefs.current[index] = element; }}
                        aria-label={`Code digit ${index + 1}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        maxLength={expectedCodeLength}
                        value={code[index] || ''}
                        onChange={(event) => handleCodeChange(index, event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Backspace' && !code[index] && index > 0) codeRefs.current[index - 1]?.focus();
                        }}
                        onPaste={(event) => {
                          event.preventDefault();
                          handleCodeChange(0, event.clipboardData.getData('text'));
                        }}
                        className="h-12 min-w-0 flex-1 rounded-lg border border-brand-border text-center text-xl font-semibold focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                      />
                    ))}
                  </div>
                  {mobileChannel && plan?.testMode?.sms && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Test mode: use 0000</p>}
                  <PrimaryButton type="submit" disabled={loading || code.length !== expectedCodeLength}>{loading ? 'Verifying…' : 'Verify code'}</PrimaryButton>
                </>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                {!mobileChannel && <button type="button" onClick={changeEmail} className="font-medium text-brand-accent underline">Wrong email? Change it</button>}
                {otpSent && (
                  <button type="button" disabled={loading || resendIn > 0} onClick={() => void sendOtp(token, mobileChannel ? 'mobile' : 'email')} className="ml-auto font-medium text-brand-accent underline disabled:cursor-not-allowed disabled:text-brand-sub">
                    {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
                  </button>
                )}
              </div>
            </form>
          )}

          {step === 'password' && (
            <form className="mt-7 space-y-4" onSubmit={savePassword}>
              <div>
                <label htmlFor="signup-password" className="mb-1 block text-sm font-medium">Create a password</label>
                <div className="flex rounded-xl border border-brand-border focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-accent/20">
                  <input id="signup-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="min-w-0 flex-1 rounded-l-xl px-4 py-3 outline-none" required minLength={8} maxLength={128} />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="rounded-r-xl px-4 text-sm font-semibold text-brand-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent">{showPassword ? 'Hide' : 'Show'}</button>
                </div>
                <p className="mt-2 text-xs text-brand-sub">Use at least 8 characters. A mix of upper/lowercase letters, numbers, and symbols makes it stronger.</p>
                <div className="mt-2 flex gap-1" aria-label={`Password strength ${passwordStrength} of 4`}>
                  {[1, 2, 3, 4].map((level) => <span key={level} className={`h-1.5 flex-1 rounded ${passwordStrength >= level ? 'bg-brand-accent' : 'bg-brand-muted'}`} />)}
                </div>
              </div>
              <PrimaryButton type="submit" disabled={loading || password.length < 8}>{loading ? 'Saving…' : 'Continue'}</PrimaryButton>
            </form>
          )}

          {step === 'trial' && (
            <div className="mt-7 space-y-5">
              <div className="rounded-2xl bg-brand-bg p-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-accent">Free trial</p>
                <p className="mt-2 font-display text-3xl font-bold">{pricingConfig.paymentCopy}</p>
                <p className="mt-2 text-sm leading-6 text-brand-sub">
                  Free for {plan?.trialMonths ?? pricingConfig.trialMonths} months, then Rs {plan?.standardPriceInr ?? pricingConfig.standardPriceInr}/month, {plan?.gst ?? pricingConfig.gstText}. {pricingConfig.cancelAnyTime}.
                </p>
                <p className="mt-3 text-sm font-medium">Your free period ends on {trialEndEstimate}.</p>
              </div>
              <label className="flex items-start gap-3 text-sm leading-6">
                <input type="checkbox" checked={autopayConsent} onChange={(event) => setAutopayConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-brand-accent" />
                <span>I authorize the recurring plan charge after my free {plan?.trialMonths ?? pricingConfig.trialMonths}-month trial. I understand the plan will cost Rs {plan?.standardPriceInr ?? pricingConfig.standardPriceInr}/month, {plan?.gst ?? pricingConfig.gstText}, and I can cancel anytime.</span>
              </label>
              <p className="text-sm text-brand-sub">We’ll email you a reminder before the first charge.</p>
              {plan?.testMode?.payment ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="button" disabled={loading || !autopayConsent} onClick={() => void confirmTrial('success')} className="min-h-12 rounded-xl bg-brand-accent px-4 py-3 font-semibold text-white hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:opacity-60">{loading ? 'Setting up…' : 'Simulate success'}</button>
                  <button type="button" disabled={loading || !autopayConsent} onClick={() => void confirmTrial('fail')} className="min-h-12 rounded-xl border border-brand-accent px-4 py-3 font-semibold text-brand-accent hover:bg-brand-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:opacity-60">Simulate failure</button>
                </div>
              ) : (
                <PrimaryButton disabled={loading || !autopayConsent} onClick={() => void confirmTrial()}>{loading ? 'Setting up…' : 'Confirm free trial'}</PrimaryButton>
              )}
            </div>
          )}

          {step === 'done' && (
            <div className="mt-10 text-center" role="status" aria-live="polite">
              <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-brand-muted border-t-brand-accent" aria-hidden="true" />
              <h2 className="font-display text-2xl font-bold">Setting up your restaurant...</h2>
              <p className="mt-2 text-sm text-brand-sub">Your free trial ends {trialEnd ? new Date(trialEnd).toLocaleDateString() : trialEndEstimate}.</p>
              <p className="mt-4 text-sm text-brand-sub">Taking longer than expected?</p>
              <a href={redirectUrl} className="mt-2 inline-block font-semibold text-brand-accent underline">Continue to your console</a>
            </div>
          )}
        </div>
        <div className="mt-5 flex justify-center gap-5 text-sm text-brand-sub">
          <a className="underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent" href="/terms-and-conditions">Terms</a>
          <a className="underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent" href="/privacy-policy">Privacy</a>
          <a className="underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent" href={`mailto:${siteConfig.supportEmail}`}>Support</a>
        </div>
      </div>
    </main>
  );
}
