const { createEvent } = require('../../shared/event-envelope.v1');

const TYPE = 'TICKET_MESSAGE';
const VERSION = 1;

const REQUIRED_FIELDS = [
  'messageId',
  'ticketId',
  'authorScope',
  'createdAt'
];

// ======================
// VALIDATION STRICTE
// ======================
function validate(payload) {

  if (!payload || typeof payload !== 'object') {
    throw new Error(
      `Invalid ${TYPE} v${VERSION}: payload is required`
    );
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in payload)) {
      throw new Error(
        `Invalid ${TYPE} v${VERSION}: missing ${field}`
      );
    }
  }
}

// ======================
// FROM MONGOOSE MODEL
// ======================
function fromModel(message, ticket = {}) {

  if (!message) {
    throw new Error('TicketMessage is required');
  }

  const payload = {
    // ======================
    // MESSAGE
    // ======================
    messageId: String(message._id),
    ticketId: String(message.ticket),

    authorId: message.author
      ? String(message.author)
      : null,

    authorScope: message.authorScope,

    message: message.message,
    action: message.action ?? 'REPLY',
    attachments: message.attachments ?? [],

    // ======================
    // ROUTING DATA (ticket)
    // ======================
    companyId: ticket.companyId ?? null,
    agencyId: ticket.agencyId ?? null,
    cityId: ticket.cityId ?? null,
    participants: ticket.participants ?? [],

    // ======================
    // TIME
    // ======================
    createdAt: message.createdAt
      ? new Date(message.createdAt).toISOString()
      : new Date().toISOString()
  };

  validate(payload);

  return createEvent({
    type: TYPE,
    version: VERSION,
    payload
  });
}

// ======================
// FROM RAW PAYLOAD
// ======================
function fromPayload(payload) {

  validate(payload);

  return createEvent({
    type: TYPE,
    version: VERSION,
    payload
  });
}

module.exports = {
  TYPE,
  VERSION,
  fromModel,
  fromPayload,
  validate
};