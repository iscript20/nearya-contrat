const { createEvent } = require('../../shared/event-envelope.v1');

const TYPE = 'PICKUP_CREATED';
const VERSION = 1;

const REQUIRED_FIELDS = [
  'pickupId',
  'companyId',
  'cityId',
  'createdAt'
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
function fromModel(pickup) {

  if (!pickup) {
    throw new Error('Pickup is required');
  }

  const payload = {
    pickupId: String(pickup._id),
    cityId: pickup.sendingCity ?? null,
    companyId: pickup.companyId ?? null,
    createdAt: pickup.createdAt
      ? new Date(pickup.createdAt).toISOString()
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