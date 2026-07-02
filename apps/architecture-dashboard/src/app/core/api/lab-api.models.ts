export type PersonaDto = {
  id: string;
  name: string;
  role: string;
  description: string;
  permissions: string[];
};

export type CurrentUserDto = {
  persona: PersonaDto;
  roles: string[];
  permissions: string[];
};

export type LoanDto = {
  id: string;
  borrowerId: string;
  loanNumber: string;
  amount: number;
  statusCode: string;
  updatedAt: string;
};

export type BorrowerDto = {
  id: string;
  name: string;
  creditScore: number;
  riskBand: string;
};

export type LoanDocumentDto = {
  id: string;
  loanId: string;
  documentType: string;
  status: string;
};

export type LoanStatusCodeDto = {
  code: string;
  label: string;
  sortOrder: number;
};

export type DashboardSnapshotDto = {
  dataset: string;
  loans: LoanDto[];
  borrowers: BorrowerDto[];
  documents: LoanDocumentDto[];
  statusCodes: LoanStatusCodeDto[];
};
