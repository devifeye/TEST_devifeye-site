'use server'

import { INTERESTS, TEAM_SIZES, type EnquiryState } from '@/lib/enquiry'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function text(formData: FormData, key: string, max: number) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function escapeSlack(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  // Honeypot: real people never see or fill this field.
  if (text(formData, 'website', 200)) {
    return { status: 'success', message: 'Thanks, we will be in touch within one business day.' }
  }

  const name = text(formData, 'name', 120)
  const email = text(formData, 'email', 200)
  const company = text(formData, 'company', 160)
  const teamSize = text(formData, 'teamSize', 40)
  const message = text(formData, 'message', 2000)
  const interests = formData
    .getAll('interests')
    .filter((v): v is (typeof INTERESTS)[number] => typeof v === 'string' && (INTERESTS as readonly string[]).includes(v))

  const values = { name, email, company, teamSize, message }
  const fieldErrors: EnquiryState['fieldErrors'] = {}
  if (name.length < 2) fieldErrors.name = 'Please tell us your name.'
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = 'Please enter a valid work email.'
  if (company.length < 2) fieldErrors.company = 'Please tell us your company.'
  if (!(TEAM_SIZES as readonly string[]).includes(teamSize)) fieldErrors.teamSize = 'Please pick a team size.'
  if (message.length < 10) fieldErrors.message = 'A sentence or two about your stack helps us prepare.'

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors, values }
  }

  const webhookUrl = process.env.SLACK_ENTERPRISE_ENQUIRY_WEBHOOK_URL
  if (!webhookUrl) {
    console.error('SLACK_ENTERPRISE_ENQUIRY_WEBHOOK_URL is not set')
    return { status: 'error', message: 'Enquiries are temporarily unavailable. Please try again shortly.', values }
  }

  const payload = {
    text: `New Enterprise enquiry from ${name} (${company})`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: 'New Enterprise enquiry' } },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Name*\n${escapeSlack(name)}` },
          { type: 'mrkdwn', text: `*Email*\n<mailto:${escapeSlack(email)}|${escapeSlack(email)}>` },
          { type: 'mrkdwn', text: `*Company*\n${escapeSlack(company)}` },
          { type: 'mrkdwn', text: `*Team size*\n${escapeSlack(teamSize)}` },
        ],
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Interested in*\n${interests.length ? interests.map(escapeSlack).join(', ') : '_Not specified_'}` },
      },
      { type: 'section', text: { type: 'mrkdwn', text: `*Message*\n${escapeSlack(message)}` } },
      { type: 'context', elements: [{ type: 'mrkdwn', text: `Sent from devifeye.com/enterprise · ${new Date().toISOString()}` }] },
    ],
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) throw new Error(`Slack responded with ${response.status}`)
  } catch (error) {
    console.error('Failed to send enterprise enquiry to Slack:', error)
    return { status: 'error', message: 'Something went wrong sending your enquiry. Please try again.', values }
  }

  return { status: 'success', message: `Thanks ${name.split(' ')[0]}, the eye has seen your message. We will reply within one business day.` }
}
