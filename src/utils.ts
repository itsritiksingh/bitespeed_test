import {Response} from 'express'
import { ContactInstance } from "./models/model";
import { IdentifyRequest, ResponseContact } from './types'

export function constructResponse(contacts: ContactInstance[]): ResponseContact {
  let primary: ContactInstance,
    secondaryContactIds: number[] = [],
    emails: (string | null)[] = [],
    phoneNumbers: (string | null)[] = [];

  contacts.forEach((i) => {
    if (i.linkPrecedence == "primary") primary = i;
    else {
      secondaryContactIds.push(i.id);
      emails.push(i.email);
      phoneNumbers.push(i.phoneNumber);
    }
  });
  
  let response: ResponseContact = {
    primaryContatctId: primary!.id,
    emails: [primary!.email].concat(emails) as string[],
    phoneNumbers: [primary!.phoneNumber].concat(phoneNumbers) as string[],
    secondaryContactIds: secondaryContactIds
  };

  return response
}

export function validateInput(req: IdentifyRequest, res: Response, next: () => void) {
  const { email, phoneNumber } = req.body;

  if (!email || !phoneNumber) {
    return res.status(400).send("Bad Request: Email and phoneNumber are required.");
  }

  next();
}