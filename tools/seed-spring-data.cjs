const { execSync } = require('node:child_process');
const { join } = require('node:path');

const root = process.cwd();
const dbName = process.env.POSTGRES_DB || 'architecture_lab';
const dbUser = process.env.POSTGRES_USER || 'architecture_lab';
const dbHost = process.env.POSTGRES_HOST || 'postgres';
const dbPort = process.env.POSTGRES_PORT || '5432';
const containerName = 'postgres';

function pad(value, size = 3) {
  return String(value).padStart(size, '0');
}

function quote(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function buildSql() {
  const borrowers = [];
  const loans = [];
  const documents = [];

  const riskBands = ['Low', 'Medium', 'High'];
  const borrowerNames = [
    'Maya Chen', 'Noah Patel', 'Sofia Ramirez', 'Liam Johnson', 'Ava Thompson',
    'Ethan Brooks', 'Zoe Carter', 'Jason Lee', 'Priya Singh', 'Noelle Kim',
    'David Nguyen', 'Emma Brooks', 'Lucas Reed', 'Amelia Ross', 'Oliver Chen',
    'Mia Clark', 'Samir Ali', 'Chloe Martinez', 'Evan Wright', 'Lily Evans',
    'Noah Davis', 'Avery Kim', 'Henry Park', 'Maya Singh', 'Carter Lee',
    'Isla Morgan', 'Miles Chen', 'Leah Brooks', 'Jacob Scott', 'Hannah Hall',
    'Jayden Fisher', 'Aria Lopez', 'Kayla White', 'Owen Carter', 'Grace Turner',
    'Sophia Black', 'Aaron Wells', 'Nina Ellis', 'Colin Shaw', 'Zara Patel',
    'Mason Price', 'Luna Bell', 'Isaac Kim', 'Ruby Cox', 'Ryan Hall', 'Lola Reed',
    'Nora Grant', 'Eli Ross', 'Ivy Scott', 'Noah West', 'Lena Ray',
  ];

  for (let index = 1; index <= 150; index += 1) {
    const id = `borrower-${pad(index)}`;
    const name = borrowerNames[(index - 1) % borrowerNames.length];
    const creditScore = 550 + ((index * 17) % 250);
    const riskBand = riskBands[index % riskBands.length];

    borrowers.push(`  (${quote(id)}, ${quote(name)}, ${creditScore}, ${quote(riskBand)})`);
  }

  const statusCodes = ['submitted', 'in_review', 'conditional_approval', 'approved', 'needs_documents'];
  const documentTypes = [
    'Income Verification', 'Credit Report', 'Appraisal', 'Bank Statement',
    'Tax Return', 'Purchase Agreement', 'Closing Disclosure', 'Debt-to-Income Statement',
    'Employment Verification', 'Title Insurance', 'Insurance Declaration', 'Property Survey',
  ];

  for (let index = 1; index <= 150; index += 1) {
    const loanId = `loan-${pad(index)}`;
    const borrowerId = `borrower-${pad(index)}`;
    const loanNumber = `TL-${1000 + index}`;
    const amount = 150000 + ((index * 137) % 800000);
    const statusCode = statusCodes[index % statusCodes.length];
    const updatedAt = 'now()';

    loans.push(`  (${quote(loanId)}, ${quote(borrowerId)}, ${quote(loanNumber)}, ${amount.toFixed(2)}, ${quote(statusCode)}, ${updatedAt})`);

    const documentCount = 2 + (index % 3);
    for (let docIndex = 1; docIndex <= documentCount; docIndex += 1) {
      const documentId = `doc-${pad((index - 1) * 3 + docIndex)}`;
      const documentType = documentTypes[(index + docIndex) % documentTypes.length];
      const status = docIndex === 1 ? 'received' : docIndex === 2 ? 'pending' : 'missing';
      documents.push(`  (${quote(documentId)}, ${quote(loanId)}, ${quote(documentType)}, ${quote(status)})`);
    }
  }

  return [
    'BEGIN;',
    '',
    'insert into borrowers (id, display_name, credit_score, risk_band) values',
    borrowers.join(',\n'),
    'on conflict (id) do nothing;',
    '',
    'insert into loan_status_codes (code, label, sort_order) values',
    statusCodes
      .map((code, idx) => `  (${quote(code)}, ${quote(code.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()))}, ${idx + 1})`)
      .join(',\n'),
    'on conflict (code) do nothing;',
    '',
    'insert into loans (id, borrower_id, loan_number, amount, status_code, updated_at) values',
    loans.join(',\n'),
    'on conflict (id) do nothing;',
    '',
    'insert into loan_documents (id, loan_id, document_type, status) values',
    documents.join(',\n'),
    'on conflict (id) do nothing;',
    '',
    'COMMIT;',
  ].join('\n');
}

function runSeed() {
  const sql = buildSql();
  const startTime = Date.now();

  console.log('Starting Spring API seed data generation...');
  console.log(`Database: ${dbName} user: ${dbUser}`);

  execSync('docker compose up -d postgres', {
    stdio: ['ignore', 'inherit', 'inherit'],
    cwd: root,
  });

  const command = `docker compose exec -T postgres psql -U ${dbUser} -d ${dbName}`;

  execSync(command, {
    input: sql,
    stdio: ['pipe', 'inherit', 'inherit'],
    cwd: root,
  });

  const duration = (Date.now() - startTime) / 1000;
  console.log(`Spring seed data completed in ${duration.toFixed(2)}s`);
}

try {
  runSeed();
} catch (error) {
  console.error('Spring seed failed:', error.message ?? error);
  process.exit(1);
}
