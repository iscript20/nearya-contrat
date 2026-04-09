const { createEvent } = require('../../shared/event-envelope.v1');

const TYPE = 'PICKUP_ASSIGNED';
const VERSION = 1;

const REQUIRED_FIELDS = [
  'assignmentId',
  'status',
  'pickupId',
  'companyId',
  'collector',
  'confirmedReturns',
  'collectedParcels',
  'totalParcels',
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
function fromModel(assignment) {

  if (!assignment) {
    throw new Error('Pickup comment is required');
  }

  const payload = {

    // ======================
    // IDS
    // ======================
    assignmentId: String(assignment._id),
    pickupId: String(assignment.pickup),
    companyId: String(assignment.company),

    status: assignment.status,
    collector: assignment.collector ?? null,
    confirmedReturns: assignment.confirmedReturns ?? null,
    collectedParcels: assignment.collectedParcels,
    totalParcels: assignment.totalParcels,
    // ======================
    // TIME
    // ======================
    createdAt: assignment.createdAt
      ? new Date(assignment.createdAt).toISOString()
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