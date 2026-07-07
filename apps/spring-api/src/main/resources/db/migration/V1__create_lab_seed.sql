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
  ('auditor', 'Auditor'),
  ('designer', 'Designer')
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
  ('developer:view', 'View developer-only lab pages'),
  ('design:view', 'View design-system labs'),
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
  ('admin', 'contracts:view'),
  ('admin', 'diagnostics:view'),
  ('admin', 'backend-comparison:view'),
  ('admin', 'realtime:view'),
  ('admin', 'developer:view'),
  ('admin', 'mcp:view'),
  ('diagnostics-admin', 'dashboard:view'),
  ('diagnostics-admin', 'diagnostics:view'),
  ('diagnostics-admin', 'backend-comparison:view'),
  ('contract-admin', 'dashboard:view'),
  ('contract-admin', 'contracts:view'),
  ('mcp-explorer', 'dashboard:view'),
  ('mcp-explorer', 'developer:view'),
  ('mcp-explorer', 'mcp:view'),
  ('realtime-operator', 'dashboard:view'),
  ('realtime-operator', 'realtime:view'),
  ('realtime-operator', 'realtime:emit'),
  ('auditor', 'dashboard:view'),
  ('auditor', 'loans:view'),
  ('auditor', 'documents:view'),
  ('designer', 'design:view'),
  ('designer', 'dashboard:view')
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
  ('owen-api-admin', 'owen-api-admin', 'contract-admin', 'Owen API Admin', 'API contract administration persona.'),
  ('adhan-designer', 'adhan-designer', 'designer', 'Adhan Designer', 'Frontend design-system lab.')
on conflict (id) do nothing;

insert into user_roles (user_id, role_id)
select user_id, role_id from personas
on conflict (user_id, role_id) do nothing;

insert into borrowers (id, display_name, credit_score, risk_band) values
  ('borrower-001', 'Maya Chen', 742, 'Low'),
  ('borrower-002', 'Noah Patel', 681, 'Medium'),
  ('borrower-003', 'Sofia Ramirez', 619, 'High'),
  ('borrower-004', 'Liam Johnson', 704, 'Medium'),
  ('borrower-005', 'Ava Thompson', 789, 'Low'),
  ('borrower-006', 'Ethan Brooks', 658, 'Medium'),
  ('borrower-007', 'Zoe Carter', 595, 'High'),
  ('borrower-008', 'Jason Lee', 728, 'Low'),
  ('borrower-009', 'Priya Singh', 690, 'Medium'),
  ('borrower-010', 'Noelle Kim', 612, 'High'),
  ('borrower-011', 'David Nguyen', 701, 'Medium'),
  ('borrower-012', 'Emma Brooks', 674, 'Medium'),
  ('borrower-013', 'Lucas Reed', 587, 'High'),
  ('borrower-014', 'Amelia Ross', 755, 'Low'),
  ('borrower-015', 'Oliver Chen', 663, 'Medium'),
  ('borrower-016', 'Mia Clark', 725, 'Low'),
  ('borrower-017', 'Samir Ali', 604, 'High'),
  ('borrower-018', 'Chloe Martinez', 692, 'Medium'),
  ('borrower-019', 'Evan Wright', 710, 'Low'),
  ('borrower-020', 'Lily Evans', 637, 'Medium'),
  ('borrower-021', 'Noah Davis', 689, 'Medium'),
  ('borrower-022', 'Avery Kim', 598, 'High'),
  ('borrower-023', 'Henry Park', 721, 'Low'),
  ('borrower-024', 'Maya Singh', 605, 'High'),
  ('borrower-025', 'Carter Lee', 674, 'Medium'),
  ('borrower-026', 'Isla Morgan', 732, 'Low'),
  ('borrower-027', 'Miles Chen', 651, 'Medium'),
  ('borrower-028', 'Leah Brooks', 619, 'High'),
  ('borrower-029', 'Jacob Scott', 707, 'Low'),
  ('borrower-030', 'Hannah Hall', 640, 'Medium')
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
  ('loan-005', 'borrower-005', 'TL-1005', 675000.00, 'approved', now()),
  ('loan-006', 'borrower-006', 'TL-1006', 238000.00, 'submitted', now()),
  ('loan-007', 'borrower-007', 'TL-1007', 156500.00, 'in_review', now()),
  ('loan-008', 'borrower-008', 'TL-1008', 442100.00, 'conditional_approval', now()),
  ('loan-009', 'borrower-009', 'TL-1009', 598300.00, 'approved', now()),
  ('loan-010', 'borrower-010', 'TL-1010', 311250.00, 'needs_documents', now()),
  ('loan-011', 'borrower-011', 'TL-1011', 274200.00, 'submitted', now()),
  ('loan-012', 'borrower-012', 'TL-1012', 489750.00, 'in_review', now()),
  ('loan-013', 'borrower-013', 'TL-1013', 339900.00, 'approved', now()),
  ('loan-014', 'borrower-014', 'TL-1014', 421500.00, 'conditional_approval', now()),
  ('loan-015', 'borrower-015', 'TL-1015', 270000.00, 'submitted', now()),
  ('loan-016', 'borrower-016', 'TL-1016', 530400.00, 'approved', now()),
  ('loan-017', 'borrower-017', 'TL-1017', 198750.00, 'needs_documents', now()),
  ('loan-018', 'borrower-018', 'TL-1018', 615800.00, 'in_review', now()),
  ('loan-019', 'borrower-019', 'TL-1019', 450600.00, 'submitted', now()),
  ('loan-020', 'borrower-020', 'TL-1020', 385000.00, 'conditional_approval', now()),
  ('loan-021', 'borrower-021', 'TL-1021', 269900.00, 'approved', now()),
  ('loan-022', 'borrower-022', 'TL-1022', 512200.00, 'submitted', now()),
  ('loan-023', 'borrower-023', 'TL-1023', 598000.00, 'in_review', now()),
  ('loan-024', 'borrower-024', 'TL-1024', 476100.00, 'conditional_approval', now()),
  ('loan-025', 'borrower-025', 'TL-1025', 307500.00, 'approved', now()),
  ('loan-026', 'borrower-026', 'TL-1026', 543200.00, 'needs_documents', now()),
  ('loan-027', 'borrower-027', 'TL-1027', 410700.00, 'submitted', now()),
  ('loan-028', 'borrower-028', 'TL-1028', 231400.00, 'in_review', now()),
  ('loan-029', 'borrower-029', 'TL-1029', 689000.00, 'approved', now()),
  ('loan-030', 'borrower-030', 'TL-1030', 354800.00, 'conditional_approval', now())
on conflict (id) do nothing;

insert into loan_documents (id, loan_id, document_type, status) values
  ('doc-001', 'loan-001', 'Income Verification', 'received'),
  ('doc-002', 'loan-001', 'Credit Report', 'received'),
  ('doc-003', 'loan-002', 'Appraisal', 'pending'),
  ('doc-004', 'loan-003', 'Bank Statement', 'missing'),
  ('doc-005', 'loan-003', 'Tax Return', 'missing'),
  ('doc-006', 'loan-004', 'Purchase Agreement', 'received'),
  ('doc-007', 'loan-005', 'Closing Disclosure', 'received'),
  ('doc-008', 'loan-006', 'Debt-to-Income Statement', 'received'),
  ('doc-009', 'loan-007', 'Employment Verification', 'pending'),
  ('doc-010', 'loan-008', 'Credit Report', 'received'),
  ('doc-011', 'loan-009', 'Appraisal', 'received'),
  ('doc-012', 'loan-010', 'Title Insurance', 'missing'),
  ('doc-013', 'loan-011', 'Purchase Agreement', 'received'),
  ('doc-014', 'loan-012', 'Insurance Declaration', 'pending'),
  ('doc-015', 'loan-013', 'Credit Report', 'received'),
  ('doc-016', 'loan-014', 'Appraisal', 'received'),
  ('doc-017', 'loan-015', 'Bank Statement', 'missing'),
  ('doc-018', 'loan-016', 'Employment Verification', 'received'),
  ('doc-019', 'loan-017', 'Tax Return', 'missing'),
  ('doc-020', 'loan-018', 'Debt-to-Income Statement', 'received'),
  ('doc-021', 'loan-019', 'Title Insurance', 'received'),
  ('doc-022', 'loan-020', 'Credit Report', 'pending'),
  ('doc-023', 'loan-021', 'Appraisal', 'received'),
  ('doc-024', 'loan-022', 'Purchase Agreement', 'received'),
  ('doc-025', 'loan-023', 'Bank Statement', 'missing'),
  ('doc-026', 'loan-024', 'Insurance Declaration', 'received'),
  ('doc-027', 'loan-025', 'Credit Report', 'pending'),
  ('doc-028', 'loan-026', 'Appraisal', 'received'),
  ('doc-029', 'loan-027', 'Tax Return', 'missing'),
  ('doc-030', 'loan-028', 'Debt-to-Income Statement', 'received')
on conflict (id) do nothing;

insert into borrowers (id, display_name, credit_score, risk_band)
select format('borrower-%s', to_char(idx, 'FM000')),
       concat('Borrower ', idx),
       550 + ((idx * 17) % 301),
       case (idx % 3)
         when 0 then 'Low'
         when 1 then 'Medium'
         else 'High'
       end
from generate_series(31, 30000) as s(idx)
on conflict (id) do nothing;

insert into loans (id, borrower_id, loan_number, amount, status_code, updated_at)
select format('loan-%s', to_char(idx, 'FM000')),
       format('borrower-%s', to_char(idx, 'FM000')),
       format('TL-%s', to_char(1000 + idx, 'FM0000')),
       180000.00 + ((idx * 7137) % 720001),
       (array['submitted', 'in_review', 'conditional_approval', 'approved', 'needs_documents'])[(idx % 5) + 1],
       now()
from generate_series(31, 30000) as s(idx)
on conflict (id) do nothing;

insert into loan_documents (id, loan_id, document_type, status)
select format('doc-%s', to_char(idx, 'FM000')),
       format('loan-%s', to_char(idx, 'FM000')),
       (array['Income Verification', 'Credit Report', 'Appraisal', 'Bank Statement', 'Title Insurance', 'Purchase Agreement', 'Closing Disclosure', 'Debt-to-Income Statement', 'Employment Verification', 'Insurance Declaration'])[(idx % 10) + 1],
       (array['received', 'pending', 'missing'])[(idx % 3) + 1]
from generate_series(31, 30000) as s(idx)
on conflict (id) do nothing;
