export type CustomerStatus = "Lead" | "Anfrage" | "Aktiv";

export type Customer = {
  id: string;
  company: string;
  contactPerson: string;
  industry: string;
  status: CustomerStatus;
  projects: number;
  email: string;
  phone: string;
};