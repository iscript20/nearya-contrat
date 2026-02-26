// EVENTS
const TicketCreatedV1 =
  require('./ticket/events/ticket-created.v1');
const TicketMessageV1 =
  require('./ticket/events/ticket-message.v1');

// TRANSPORT SERIALIZERS
const {
  serializeEventForRedis,
  deserializeEventFromRedis
} = require('./transport/redis.serializer');

module.exports = {
  // events
  TicketCreatedV1,
  TicketMessageV1,

  // serializers
  serializeEventForRedis,
  deserializeEventFromRedis
};