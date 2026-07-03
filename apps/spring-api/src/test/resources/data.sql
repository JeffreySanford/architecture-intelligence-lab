insert into roles (id, label) values
  ('viewer', 'Viewer');

insert into permissions (id, label) values
  ('dashboard:view', 'Open dashboard views');

insert into users (id, display_name) values
  ('alice-viewer', 'Alice Viewer');

insert into personas (id, user_id, role_id, display_name, description) values
  ('alice-viewer', 'alice-viewer', 'viewer', 'Alice Viewer', 'Read-only dashboard learner.');

insert into borrowers (id, display_name, credit_score, risk_band) values
  ('borrower-001', 'Maya Chen', 742, 'Low');

insert into loan_status_codes (code, label, sort_order) values
  ('submitted', 'Submitted', 1);

insert into loans (id, borrower_id, loan_number, amount, status_code, updated_at) values
  ('loan-001', 'borrower-001', 'TL-1001', 325000.00, 'submitted', current_timestamp());

insert into loan_documents (id, loan_id, document_type, status) values
  ('doc-001', 'loan-001', 'Income Verification', 'received');
