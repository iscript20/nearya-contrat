const { createEvent } = require('../../shared/event-envelope.v1');

const TYPE = 'TICKET_CLOSED';
const VERSION = 1;

const REQUIRED_FIELDS = [
  'ticketId',
  'closedBy',
  'closedAt',
];

function validate(payload) {
  for (const field of REQUIRED_FIELDS) {
    if (!payload[field]) {
      throw new Error(
        `Invalid ${TYPE} v${VERSION}: missing ${field}`
      );
    }
  }
}

function create(payload) {
  validate(payload);

  return createEvent({
    type: TYPE,
    version: VERSION,
    payload,
  });
}

module.exports = {
  TYPE,
  VERSION,
  validate,
  create,
};
