function serializeEventForRedis(event) {
  return {
    eventId: String(event.eventId),
    type: String(event.type),
    version: String(event.version),
    payload: JSON.stringify(event.payload),
    occurredAt:
      String(event.occurredAt ?? new Date().toISOString())
  };
}

function deserializeEventFromRedis(message) {
  return {
    eventId: message.eventId,
    type: message.type,
    version: Number(message.version),
    payload: JSON.parse(message.payload),
    occurredAt: message.occurredAt
  };
}

module.exports = {
  serializeEventForRedis,
  deserializeEventFromRedis
};