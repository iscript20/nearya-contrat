const { randomUUID } = require('crypto');

function createEvent({ type, version, payload }) {

  if (!type) throw new Error('Event type required');
  if (!version) throw new Error('Event version required');

  return {
    eventId: randomUUID(), // ✅ FIX ICI
    type,
    version,
    payload,
    occurredAt: new Date().toISOString()
  };
}

module.exports = { createEvent };