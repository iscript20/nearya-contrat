// EVENTS
const TicketCreatedV1 =
  require('./ticket/events/ticket-created.v1');

// TRANSPORT SERIALIZERS
const {
  serializeEventForRedis,
  deserializeEventFromRedis
} = require('./transport/redis.serializer');

module.exports = {
  // events
  TicketCreatedV1,

  // serializers
  serializeEventForRedis,
  deserializeEventFromRedis
};