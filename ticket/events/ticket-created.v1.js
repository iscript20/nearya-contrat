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
/**
 * 🔁 NORMALISATION depuis le MODEL Ticket (producer)
 */
function fromModel(ticket) {

  if (!ticket) {
    throw new Error('Ticket is required');
  }

  const payload = {
    ticketId: String(ticket._id),
    agencyId: ticket.agencyId ?? null,
    cityId: ticket.cityId ?? null,
    companyId: ticket.companyId ?? null,
    participants: ticket.participants ?? [],
    status: ticket.status,
    createdById: ticket.createdById,
    createdAt: ticket.createdAt
      ? new Date(ticket.createdAt).toISOString()
      : new Date().toISOString()
  };

  validate(payload);

  return createEvent({
    type: TYPE,
    version: VERSION,
    payload,
  });
}

/**
 * 🔁 NORMALISATION depuis un payload brut
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
  fromModel,
  fromPayload,
  validate,
};