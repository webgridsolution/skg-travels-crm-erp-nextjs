ALTER TABLE payments
  ADD COLUMN request_key CHAR(36) NULL,
  ADD UNIQUE KEY uq_payment_request_key(company_id, request_key);

ALTER TABLE payment_refunds
  ADD COLUMN request_key CHAR(36) NULL,
  ADD UNIQUE KEY uq_refund_request_key(payment_id, request_key);
