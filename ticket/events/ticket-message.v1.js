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

    const value = payload[field];

    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {
      throw new Error(
        `Invalid ${TYPE} v${VERSION}: missing ${field}`
      );
    }
  }
}

// ======================
// FROM MONGOOSE MODEL
// ======================
function fromModel(message) {

  if (!message) {
    throw new Error('TicketMessage is required');
  }

  const payload = {
    // ======================
    // MESSAGE
    // ======================
    messageId: String(message._id),
    ticketId: String(message.ticket),

    author: message.author
    ? (
        typeof message.author.toObject === 'function'
          ? message.author.toObject()
          : message.author
      )
    : null,

    authorScope: message.authorScope,

    message: message.message,
    action: message.action ?? 'REPLY',
    attachments: message.attachments ?? [],

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