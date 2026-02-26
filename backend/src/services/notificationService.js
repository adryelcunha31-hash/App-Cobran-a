export async function sendBillingNotification({ channel, recipient, message }) {
  return {
    channel,
    recipient,
    message,
    status: 'QUEUED',
    provider: channel === 'WHATSAPP' ? 'mock-whatsapp-gateway' : 'mock-email-smtp'
  };
}
