const { createEvent } = require('../../shared/event-envelope.v1');

const TYPE = 'TICKET_CREATED';
const VERSION = 1;

const REQUIRED_FIELDS = [
  'ticketId',
  'agencyId',
  'cityId',
  'companyId',
  'status',
  'createdById',
  'createdAt',
];

/**
 * Validation STRICTE du payload normalisé
 */
function validate(payload) {
  for (const field of REQUIRED_FIELDS) {
    if (!payload[field]) {
      throw new Error(
        `Invalid ${TYPE} v${VERSION}: missing ${field}`
      );
    }
  }
}

/**
 * 🔁 NORMALISATION depuis le MODEL Ticket (producer)
 */
function fromTicket(ticket) {
  if (!ticket) {
    throw new Error('Ticket is required');
  }

  const payload = {
    ticketId,
    agencyId,
    cityId,
    companyId,
    participants,
    createdById,
    createdAt
  };

  validate(payload);

  return createEvent({
    type: TYPE,
    version: VERSION,
    payload,
  });
}

/**
 * 🔁 NORMALISATION depuis un payload brut (consumer / replay / DLQ)
 */
function fromPayload(payload) {
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
  fromTicket,
  fromPayload,
  validate,
};
