create table if not exists users (
  id varchar(80) primary key,
  display_name varchar(160) not null
);

create table if not exists roles (
  id varchar(80) primary key,
  label varchar(160) not null
);

create table if not exists permissions (
  id varchar(120) primary key,
  label varchar(200) not null
);

create table if not exists personas (
  id varchar(80) primary key,
  user_id varchar(80) not null references users(id),
  role_id varchar(80) not null references roles(id),
  display_name varchar(160) not null,
  description varchar(400) not null
);

create table if not exists user_roles (
  user_id varchar(80) not null references users(id),
  role_id varchar(80) not null references roles(id),
  primary key (user_id, role_id)
);

create table if not exists role_permissions (
  role_id varchar(80) not null references roles(id),
  permission_id varchar(120) not null references permissions(id),
  primary key (role_id, permission_id)
);

create table if not exists borrowers (
  id varchar(80) primary key,
  display_name varchar(160) not null,
  credit_score integer not null,
  risk_band varchar(40) not null
);

create table if not exists loan_status_codes (
  code varchar(40) primary key,
  label varchar(120) not null,
  sort_order integer not null
);

create table if not exists loans (
  id varchar(80) primary key,
  borrower_id varchar(80) not null references borrowers(id),
  loan_number varchar(80) not null,
  amount numeric(12, 2) not null,
  status_code varchar(40) not null references loan_status_codes(code),
  updated_at timestamp not null
);

create table if not exists loan_documents (
  id varchar(80) primary key,
  loan_id varchar(80) not null references loans(id),
  document_type varchar(120) not null,
  status varchar(80) not null
);

insert into roles (id, label) values
  ('viewer', 'Viewer'),
  ('reviewer', 'Reviewer'),
  ('approver', 'Approver'),
  ('admin', 'Admin'),
  ('diagnostics-admin', 'Diagnostics Admin'),
  ('contract-admin', 'Contract Admin'),
  ('realtime-operator', 'Realtime Operator'),
  ('mcp-explorer', 'MCP Explorer'),
  ('auditor', 'Auditor')
on conflict (id) do nothing;

insert into permissions (id, label) values
  ('dashboard:view', 'Open dashboard views'),
  ('loans:view', 'View loan records'),
  ('loans:update', 'Update loan status'),
  ('documents:view', 'View document metadata'),
  ('documents:update', 'Update document metadata'),
  ('admin:view', 'View admin lab'),
  ('diagnostics:view', 'View diagnostics panels'),
  ('contracts:view', 'View OpenAPI contract lab'),
  ('mcp:view', 'View MCP dashboard'),
  ('realtime:view', 'View realtime lab'),
  ('realtime:emit', 'Trigger demo realtime events'),
  ('backend-comparison:view', 'View backend comparison lab')
on conflict (id) do nothing;

insert into role_permissions (role_id, permission_id) values
  ('viewer', 'dashboard:view'),
  ('viewer', 'loans:view'),
  ('reviewer', 'dashboard:view'),
  ('reviewer', 'loans:view'),
  ('reviewer', 'documents:view'),
  ('approver', 'dashboard:view'),
  ('approver', 'loans:view'),
  ('approver', 'loans:update'),
  ('admin', 'dashboard:view'),
  ('admin', 'loans:view'),
  ('admin', 'loans:update'),
  ('admin', 'documents:view'),
  ('admin', 'documents:update'),
  ('admin', 'admin:view'),
  ('diagnostics-admin', 'dashboard:view'),
  ('diagnostics-admin', 'diagnostics:view'),
  ('diagnostics-admin', 'backend-comparison:view'),
  ('contract-admin', 'dashboard:view'),
  ('contract-admin', 'contracts:view'),
  ('mcp-explorer', 'dashboard:view'),
  ('mcp-explorer', 'mcp:view'),
  ('realtime-operator', 'dashboard:view'),
  ('realtime-operator', 'realtime:view'),
  ('realtime-operator', 'realtime:emit'),
  ('auditor', 'dashboard:view'),
  ('auditor', 'loans:view'),
  ('auditor', 'documents:view')
on conflict (role_id, permission_id) do nothing;

insert into users (id, display_name) values
  ('alice-viewer', 'Alice Viewer'),
  ('ben-reviewer', 'Ben Reviewer'),
  ('cara-approver', 'Cara Approver'),
  ('diana-admin', 'Diana Admin'),
  ('ethan-diagnostics-admin', 'Ethan Diagnostics Admin'),
  ('fiona-contract-admin', 'Fiona Contract Admin'),
  ('grace-realtime-operator', 'Grace Realtime Operator'),
  ('henry-mcp-explorer', 'Henry MCP Explorer'),
  ('irene-document-reviewer', 'Irene Document Reviewer'),
  ('jason-auditor', 'Jason Auditor'),
  ('morgan-platform-admin', 'Morgan Platform Admin'),
  ('nora-security-admin', 'Nora Security Admin'),
  ('owen-api-admin', 'Owen API Admin')
on conflict (id) do nothing;

insert into personas (id, user_id, role_id, display_name, description) values
  ('alice-viewer', 'alice-viewer', 'viewer', 'Alice Viewer', 'Read-only dashboard learner.'),
  ('ben-reviewer', 'ben-reviewer', 'reviewer', 'Ben Reviewer', 'Reviews loans and documents.'),
  ('cara-approver', 'cara-approver', 'approver', 'Cara Approver', 'Can approve loan status movement.'),
  ('diana-admin', 'diana-admin', 'admin', 'Diana Admin', 'Full admin exercise persona.'),
  ('ethan-diagnostics-admin', 'ethan-diagnostics-admin', 'diagnostics-admin', 'Ethan Diagnostics Admin', 'Inspects backend diagnostics and comparisons.'),
  ('fiona-contract-admin', 'fiona-contract-admin', 'contract-admin', 'Fiona Contract Admin', 'Inspects API contracts and generated clients.'),
  ('grace-realtime-operator', 'grace-realtime-operator', 'realtime-operator', 'Grace Realtime Operator', 'Triggers realtime events.'),
  ('henry-mcp-explorer', 'henry-mcp-explorer', 'mcp-explorer', 'Henry MCP Explorer', 'Explores Angular CLI MCP guidance.'),
  ('irene-document-reviewer', 'irene-document-reviewer', 'reviewer', 'Irene Document Reviewer', 'Reviews document metadata.'),
  ('jason-auditor', 'jason-auditor', 'auditor', 'Jason Auditor', 'Audits loan and document state.'),
  ('morgan-platform-admin', 'morgan-platform-admin', 'admin', 'Morgan Platform Admin', 'Platform administration persona.'),
  ('nora-security-admin', 'nora-security-admin', 'admin', 'Nora Security Admin', 'Security administration persona.'),
  ('owen-api-admin', 'owen-api-admin', 'contract-admin', 'Owen API Admin', 'API contract administration persona.')
on conflict (id) do nothing;

insert into user_roles (user_id, role_id)
select user_id, role_id from personas
on conflict (user_id, role_id) do nothing;

insert into borrowers (id, display_name, credit_score, risk_band) values
  ('borrower-001', 'Maya Chen', 742, 'Low'),
  ('borrower-002', 'Noah Patel', 681, 'Medium'),
  ('borrower-003', 'Sofia Ramirez', 619, 'High'),
  ('borrower-004', 'Liam Johnson', 704, 'Medium'),
  ('borrower-005', 'Ava Thompson', 789, 'Low')
on conflict (id) do nothing;

insert into loan_status_codes (code, label, sort_order) values
  ('submitted', 'Submitted', 1),
  ('in_review', 'In Review', 2),
  ('conditional_approval', 'Conditional Approval', 3),
  ('approved', 'Approved', 4),
  ('needs_documents', 'Needs Documents', 5)
on conflict (code) do nothing;

insert into loans (id, borrower_id, loan_number, amount, status_code, updated_at) values
  ('loan-001', 'borrower-001', 'TL-1001', 325000.00, 'submitted', now()),
  ('loan-002', 'borrower-002', 'TL-1002', 418500.00, 'in_review', now()),
  ('loan-003', 'borrower-003', 'TL-1003', 289900.00, 'needs_documents', now()),
  ('loan-004', 'borrower-004', 'TL-1004', 512000.00, 'conditional_approval', now()),
  ('loan-005', 'borrower-005', 'TL-1005', 675000.00, 'approved', now())
on conflict (id) do nothing;

insert into loan_documents (id, loan_id, document_type, status) values
  ('doc-001', 'loan-001', 'Income Verification', 'received'),
  ('doc-002', 'loan-001', 'Credit Report', 'received'),
  ('doc-003', 'loan-002', 'Appraisal', 'pending'),
  ('doc-004', 'loan-003', 'Bank Statement', 'missing'),
  ('doc-005', 'loan-003', 'Tax Return', 'missing'),
  ('doc-006', 'loan-004', 'Purchase Agreement', 'received'),
  ('doc-007', 'loan-005', 'Closing Disclosure', 'received')
on conflict (id) do nothing;
