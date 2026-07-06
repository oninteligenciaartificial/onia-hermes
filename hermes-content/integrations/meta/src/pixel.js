'use strict';
// Meta Pixel (browser) + Conversions API (server) helpers.
// - The Pixel base code goes on the Web Factory landing (client-side, public id).
// - The CAPI event is sent server-side with the same event_id, so browser and
//   server events DEDUPE instead of double-counting.
// PII (email/phone) is ALWAYS sha256-hashed before it leaves this process.
const crypto = require('node:crypto');

/** @param {unknown} id */
function isValidPixelId(id) {
  return typeof id === 'string' && /^[0-9]+$/.test(id);
}

function assertPixelId(id) {
  if (!isValidPixelId(id)) throw new Error(`invalid pixel id (must be digits): ${id}`);
}

/**
 * Standard Meta Pixel base snippet, ready to drop into a landing's <head>.
 * @param {string} pixelId
 */
function generatePixelBaseCode(pixelId) {
  assertPixelId(pixelId);
  return `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/></noscript>
<!-- End Meta Pixel Code -->`;
}

/** Fresh dedup key shared between the browser fbq call and the CAPI event. */
function newEventId() {
  return crypto.randomUUID();
}

/**
 * The browser-side track call to fire on a conversion, carrying the shared
 * eventID so it deduplicates against the server CAPI event.
 * @param {string} eventName
 * @param {string} eventId
 */
function generateBrowserTrackCall(eventName, eventId) {
  return `fbq('track', '${eventName}', {}, { eventID: '${eventId}' });`;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}
const normalizeEmail = (v) => String(v).trim().toLowerCase();
const normalizePhone = (v) => String(v).replace(/[^0-9]/g, '');

/**
 * Build one Conversions API event object (server-side). Wrap it as
 * { data: [event], access_token } at send time (the client does this).
 * @param {{ eventName: string, eventId?: string, eventSourceUrl?: string,
 *   userData?: { email?: string, phone?: string, fbp?: string, fbc?: string },
 *   customData?: object, clientUserAgent?: string, clientIpAddress?: string,
 *   actionSource?: string, eventTime?: number }} input
 */
function buildCapiEvent(input = {}) {
  const {
    eventName, eventId, eventSourceUrl, userData = {}, customData,
    clientUserAgent, clientIpAddress, actionSource = 'website', eventTime,
  } = input;
  if (!eventName) throw new Error('capi event: eventName required');

  const user_data = {};
  if (userData.email) user_data.em = [sha256(normalizeEmail(userData.email))];
  if (userData.phone) user_data.ph = [sha256(normalizePhone(userData.phone))];
  if (userData.fbp) user_data.fbp = userData.fbp;
  if (userData.fbc) user_data.fbc = userData.fbc;
  if (clientUserAgent) user_data.client_user_agent = clientUserAgent;
  if (clientIpAddress) user_data.client_ip_address = clientIpAddress;

  const event = {
    event_name: eventName,
    event_time: eventTime || Math.floor(Date.now() / 1000),
    event_id: eventId || newEventId(),
    action_source: actionSource,
    user_data,
  };
  if (eventSourceUrl) event.event_source_url = eventSourceUrl;
  if (customData) event.custom_data = customData;
  return event;
}

module.exports = {
  generatePixelBaseCode,
  buildCapiEvent,
  newEventId,
  generateBrowserTrackCall,
  isValidPixelId,
};
