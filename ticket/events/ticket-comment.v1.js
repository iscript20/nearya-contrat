const { createEvent } = require('../../shared/event-envelope.v1');

const TYPE = 'TICKET_COMMENT';
const VERSION = 1;

const REQUIRED_FIELDS = [
  'commentId',
  'ticketId',
  'author',
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
function fromModel(comment) {

  if (!comment) {
    throw new Error('TicketComment is required');
  }

  const payload = {

    // ======================
    // IDS
    // ======================
    commentId: String(comment._id),
    ticketId: String(comment.ticket),

    // ======================
    // AUTHOR (SNAPSHOT ONLY)
    // ======================
    authorSnapshot: comment.authorSnapshot ?? null,

    // ======================
    // CONTENT
    // ======================
    comment: comment.comment,
    visibility: comment.visibility,
    attachments: comment.attachments ?? [],
    meta: comment.meta ?? {},

    // ======================
    // TIME
    // ======================
    createdAt: comment.createdAt
      ? new Date(comment.createdAt).toISOString()
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