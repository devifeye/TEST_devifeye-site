'use client'

import { useActionState } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { submitEnquiry } from '@/app/enterprise/actions'
import { INTERESTS, TEAM_SIZES, type EnquiryField, type EnquiryState } from '@/lib/enquiry'
import { linkButton } from '@/lib/site'
import { cn } from '@/lib/utils'

const initialState: EnquiryState = { status: 'idle' }

const inputClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring aria-[invalid=true]:border-destructive'

function FieldShell({
  id,
  label,
  error,
  className,
  children,
}: {
  id: EnquiryField
  label: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export function EnquiryForm() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState)
  const errors = state.fieldErrors ?? {}
  const values = state.values ?? {}
  const invalid = (field: EnquiryField) => (errors[field] ? { 'aria-invalid': true, 'aria-describedby': `${field}-error` } : {})

  if (state.status === 'success') {
    return (
      <div role="status" className="flex flex-col items-start gap-4 py-6">
        <div className="flex size-11 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-semibold">Enquiry received.</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldShell id="name" label="Name" error={errors.name}>
          <input id="name" name="name" autoComplete="name" required defaultValue={values.name} className={inputClass} {...invalid('name')} />
        </FieldShell>
        <FieldShell id="email" label="Work email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={values.email}
            placeholder="you@company.com"
            className={inputClass}
            {...invalid('email')}
          />
        </FieldShell>
        <FieldShell id="company" label="Company" error={errors.company}>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            required
            defaultValue={values.company}
            className={inputClass}
            {...invalid('company')}
          />
        </FieldShell>
        <FieldShell id="teamSize" label="Engineering team size" error={errors.teamSize}>
          <select
            id="teamSize"
            name="teamSize"
            required
            defaultValue={values.teamSize ?? ''}
            className={cn(inputClass, 'h-[38px]')}
            {...invalid('teamSize')}
          >
            <option value="" disabled>
              Select…
            </option>
            {TEAM_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-medium">
          {'Interested in '}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <label
              key={interest}
              className="cursor-pointer rounded-full border border-input px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-foreground has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring"
            >
              <input type="checkbox" name="interests" value={interest} className="sr-only" />
              {interest}
            </label>
          ))}
        </div>
      </fieldset>

      <FieldShell id="message" label="What should the eye watch?" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          maxLength={2000}
          defaultValue={values.message}
          placeholder="Our stack, environments, compliance requirements, the drift that bit us last quarter…"
          className={cn(inputClass, 'resize-y')}
          {...invalid('message')}
        />
      </FieldShell>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-muted-foreground">We reply within one business day.</p>
        <button type="submit" disabled={pending} className={cn(linkButton.primary, 'disabled:opacity-70')}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Send enquiry
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      {state.status === 'error' && state.message && (
        <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}
    </form>
  )
}
