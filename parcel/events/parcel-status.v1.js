const { createEvent } = require('../../shared/event-envelope.v1');
const crypto = require('crypto');

const TYPE = 'PARCEL_STATUS';
const VERSION = 1;

// ======================
// REQUIRED (core métier)
// ======================
const REQUIRED_FIELDS = [
  '_id',
  'companyId',
  'seller',
  'cityId',
  'cab',
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
// GENERATE EVENT ID
// ======================
function generateEventId() {
  return crypto.randomUUID();
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
    _id: String(parcel._id),
    companyId: String(parcel.company),
    seller: String(parcel.seller),
    cityId: String(parcel.city),
    cab: parcel.cab,
    recipient: parcel.recipient,
    recipientPhone: parcel.recipientPhone,
    status: parcel.status,
    lang: parcel.lang,
    amount: parcel.amount,
    date: parcel.date,

    createdAt: parcel.createdAt
      ? new Date(parcel.createdAt).toISOString()
      : new Date().toISOString(),

    // ======================
    // META (OPTIONAL)
    // ======================
    recipientAddress: parcel.recipientAddress ?? null,

  };

  validate(payload);

  return createEvent({
    id: generateEventId(),
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
    id: generateEventId(),
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