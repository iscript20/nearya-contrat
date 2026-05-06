const { createEvent } = require('../../shared/event-envelope.v1');
const { v4: uuid } = require('uuid');

const TYPE = 'PARCEL_STATUS';
const VERSION = 1;

// ======================
// REQUIRED (core métier)
// ======================
const REQUIRED_FIELDS = [
  'parcelId',
  'companyId',
  'cityId',
  'reference',
  'recipient',
  'recipientPhone',
  'amount',
  'status',
  'lang',
  'createdAt'
];

// ======================
// VALIDATION
// ======================
function validate(payload) {

  if (!payload || typeof payload !== 'object') {
    throw new Error(`Invalid ${TYPE} v${VERSION}: payload is required`);
  }

  for (const field of REQUIRED_FIELDS) {
    if (payload[field] === undefined || payload[field] === '') {
      throw new Error(`Invalid ${TYPE}: missing ${field}`);
    }
  }
}

// ======================
// FROM MODEL
// ======================
function fromModel(parcel) {

  if (!parcel) {
    throw new Error('parcel is required');
  }

  const payload = {

    // ======================
    // CORE (REQUIRED)
    // ======================
    parcelId: String(parcel._id),
    companyId: String(parcel.company),
    cityId: String(parcel.city),
    reference: parcel.reference,
    recipientPhone: parcel.recipientPhone,
    status: parcel.status,

    createdAt: parcel.createdAt
      ? new Date(parcel.createdAt).toISOString()
      : new Date().toISOString(),

    // ======================
    // META (OPTIONAL)
    // ======================
    cab: parcel.cab ?? null,
    recipient: parcel.recipient ?? null,
    recipientAddress: parcel.recipientAddress ?? null,
    price: parcel.price ?? null

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