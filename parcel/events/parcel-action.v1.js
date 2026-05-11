const { createEvent } = require('../../shared/event-envelope.v1');
const { v4: uuid } = require('uuid');

const TYPE = 'PARCEL_ACTION';
const VERSION = 1;

// ======================
// REQUIRED (core métier)
// ======================
const REQUIRED_FIELDS = [
  'action'
];

// ======================
// VALIDATION
// ======================
function validate(payload) {

  if (
    !payload ||
    typeof payload !== 'object'
  ) {
    throw new Error(
      `Invalid ${TYPE} v${VERSION}: payload is required`
    );
  }

  // ======================
  // REQUIRED FIELDS
  // ======================
  for (const field of REQUIRED_FIELDS) {

    if (
      payload[field] === undefined ||
      payload[field] === ''
    ) {

      throw new Error(
        `Invalid ${TYPE}: missing ${field}`
      );
    }
  }

  // ======================
  // REQUIRE parcelId OR _ids
  // ======================
  const hasParcelId =
    !!payload.parcelId;

  const hasIds =
    Array.isArray(payload._ids) &&
    payload._ids.length > 0;

  if (
    !hasParcelId &&
    !hasIds
  ) {

    throw new Error(
      `Invalid ${TYPE}: parcelId or _ids is required`
    );
  }
}

// ======================
// FROM MODEL
// ======================
function fromModel(data) {

  if (!data) {
    throw new Error('data is required');
  }

  const payload = {

    _ids:
      data._ids,

    parcelId:
      data.parcelId
        ? String(data.parcelId)
        : null,

    action:
      String(data.action),

    location:
      data.location
  };

  validate(payload);

  return createEvent({
    id: uuid(),
    type: TYPE,
    version: VERSION,
    occurredAt: new Date().toISOString(),
    payload
  });
}

// ======================
// FROM RAW PAYLOAD
// ======================
function fromPayload(payload) {

  validate(payload);

  return createEvent({
    id: uuid(),
    type: TYPE,
    version: VERSION,
    occurredAt: new Date().toISOString(),
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