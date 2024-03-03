import { Request } from "express";
export type Contact = {
  id: number;
  phoneNumber: string;
  email: string;
  linkedId: number | null;
  linkPrecedence: "primary" | "secondary";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ResponseContact = {
  primaryContatctId: number;
  emails: string[]; // first element being email of primary contact
  phoneNumbers: string[]; // first element being phoneNumber of primary contact
  secondaryContactIds: number[]; // Array of all Contact IDs that are "secondary" to the primary contact
};

export type IdentifyResponse = {
  contact: ResponseContact;
};

export interface IdentifyRequest extends Request {
  body: {
    email: string;
    phoneNumber: string;
  };
}
