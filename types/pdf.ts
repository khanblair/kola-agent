export type PDFDocumentType = 'scope-report' | 'proposal';

export interface PDFSection {
  title: string;
  content: string;
}

export interface ExportOptions {
  documentType: PDFDocumentType;
  title: string;
  sections: PDFSection[];
}
