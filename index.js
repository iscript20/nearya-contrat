// EVENTS
//TICKETS
const TicketCreatedV1 =
  require('./ticket/events/ticket-created.v1');
const TicketMessageV1 =
  require('./ticket/events/ticket-message.v1');
const TicketCommentV1 =
  require('./ticket/events/ticket-comment.v1');

//PICKUPS
  const PickupCommentV1 =
  require('./pickup/events/pickup-comment.v1');
  const PickupCreatedV1 =
  require('./pickup/events/pickup-created.v1');
  const PickupAssignedV1 =
  require('./pickup/events/pickup-assigned.v1');

// TRANSPORT SERIALIZERS
const {
  serializeEventForRedis,
  deserializeEventFromRedis
} = require('./transport/redis.serializer');

module.exports = {
  // events Ticket
  TicketCreatedV1,
  TicketMessageV1,
  TicketCommentV1,

  //events Pickup
  PickupCommentV1,
  PickupCreatedV1,
  PickupAssignedV1,

  // serializers
  serializeEventForRedis,
  deserializeEventFromRedis
};