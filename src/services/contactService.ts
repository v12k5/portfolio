export interface ContactPayload { name: string; email: string; message: string }
export type ContactResult = { status: 'sent' } | { status: 'not_configured' } | { status: 'error'; message: string };
export async function submitContactMessage(payload: ContactPayload): Promise<ContactResult> { void payload; return { status: 'not_configured' }; }
