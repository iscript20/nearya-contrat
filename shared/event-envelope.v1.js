function createEvent({ type, version, payload }) {
  return {
    type,
    version,
    payload,
    occurredAt: new Date().toISOString(),
  };
}

module.exports = { createEvent };
