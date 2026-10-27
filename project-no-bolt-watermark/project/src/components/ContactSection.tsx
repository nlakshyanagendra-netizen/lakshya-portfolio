import { useState, type FormEvent } from 'react';
import { Github, Linkedin, Mail, Send, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { site } from '@/config/site';
import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

type Errors = { name?: string; email?: string; subject?: string; message?: string; honeypot?: string };
type Status = 'idle' | 'submitting' | 'error' | 'sent' | 'not-configured';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactSection() {
  const reduced = usePrefersReducedMotion();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', company: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.email.trim()) e.email = 'Please enter your email.';
    else if (!EMAIL_RE.test(form.email)) e.email = 'That email address looks invalid.';
    if (!form.subject.trim()) e.subject = 'Please add a subject.';
    if (!form.message.trim()) e.message = 'Please write a message.';
    else if (form.message.trim().length < 10) e.message = 'Message is a little short.';
    if (form.company) e.honeypot = 'Spam detected.'; // honeypot
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('submitting');

    // Honeypot filled — silently drop without revealing.
    if (form.company) {
      setStatus('sent');
      return;
    }

    // If no endpoint configured, do not fake success.
    if (!site.contactEndpoint) {
      setStatus('not-configured');
      return;
    }

    try {
      const res = await fetch(site.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, subject: form.subject, message: form.message,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '', company: '' });
    } catch {
      setStatus('error');
    }
  };

  const emailHref = site.email
    ? `mailto:${site.email}?subject=${encodeURIComponent(form.subject || 'Project enquiry')}&body=${encodeURIComponent(form.message)}`
    : null;

  return (
    <section id="contact" className="section">
      <div className="text-center max-w-2xl mx-auto">
        <p className="t-label t-label-center justify-center">05 · Contact</p>
        <h2 className="section-title">Have something interesting to build?</h2>
        <p className="section-sub mx-auto">
          I'm interested in ambitious experiments, unusual engineering problems, robotics, and ideas that cross the boundary between physics and software.
        </p>
      </div>

      <div className="mt-12 grid lg:grid-cols-[1fr_1.3fr] gap-6">
        {/* Socials */}
        <div className={cn('panel frame p-6', reduced ? '' : 'animate-fade-up')}>
          <h3 className="text-fg-bright font-display font-semibold">Direct links</h3>
          <div className="mt-5 space-y-3">
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 panel px-4 py-3 hover:border-cyan/40 transition-colors group"
            >
              <Github size={18} className="text-fg-muted group-hover:text-cyan" />
              <span className="text-sm text-fg group-hover:text-cyan">GitHub</span>
              <span className="ml-auto text-xs text-fg-dim mono">/nlakshyanagendra-netizen</span>
            </a>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 panel px-4 py-3 hover:border-cyan/40 transition-colors group"
            >
              <Linkedin size={18} className="text-fg-muted group-hover:text-cyan" />
              <span className="text-sm text-fg group-hover:text-cyan">LinkedIn</span>
              <span className="ml-auto text-xs text-fg-dim mono truncate">/lakshya-nagendra-nakka</span>
            </a>
            <div className="flex items-center gap-3 panel px-4 py-3">
              <Mail size={18} className="text-fg-muted" />
              {site.email ? (
                <a href={`mailto:${site.email}`} className="text-sm text-fg link-underline">{site.email}</a>
              ) : (
                <span className="text-sm text-fg-dim">Email will appear here once added in config</span>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-start gap-2 text-xs text-fg-dim leading-relaxed">
            <ShieldCheck size={14} className="shrink-0 mt-0.5 text-fg-dim" />
            <span>Privacy note: this form only sends the fields you fill in. No tracking, no analytics, no third-party cookies.</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className={cn('panel frame p-6', reduced ? '' : 'animate-fade-up')} style={{ animationDelay: '0.1s' }} noValidate>
          {/* Honeypot — hidden from users */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="absolute opacity-0 -left-[9999px] h-0 w-0"
            aria-hidden="true"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                aria-invalid={!!errors.name}
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                aria-invalid={!!errors.email}
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Subject" error={errors.subject}>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="input"
                aria-invalid={!!errors.subject}
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Message" error={errors.message}>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                className="input resize-y"
                aria-invalid={!!errors.message}
              />
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={status === 'submitting'} className="btn btn-primary disabled:opacity-50">
              <Send size={14} /> {status === 'submitting' ? 'Sending…' : 'Send message'}
            </button>

            {emailHref && (
              <a href={emailHref} className="btn btn-ghost">
                <Mail size={14} /> Open in email app
              </a>
            )}
          </div>

          {status === 'sent' && (
            <p className="mt-4 flex items-center gap-2 text-sm text-success">
              <ShieldCheck size={14} /> Message sent — thanks, I'll reply soon.
            </p>
          )}
          {status === 'error' && (
            <p className="mt-4 flex items-center gap-2 text-sm text-error">
              <AlertCircle size={14} /> Something went wrong sending. Please try the email link instead.
            </p>
          )}
          {status === 'not-configured' && (
            <div className="mt-4 panel px-4 py-3 flex items-start gap-2 text-sm text-fg-muted border-amber/30">
              <Info size={14} className="shrink-0 mt-0.5 text-amber" />
              <span>
                Submission isn't wired up yet — add a contact endpoint or your email address in the config file.
                {emailHref && <> In the meantime, use the “Open in email app” button above.</>}
              </span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs mono text-fg-dim mb-1.5 tracking-wider uppercase">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-error">{error}</span>}
    </label>
  );
}
