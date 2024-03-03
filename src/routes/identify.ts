import express, { Response } from "express";
import { findContact, saveContact, upsertContact } from "../dao/contacts";
import { constructResponse, validateInput, } from "../utils";
import { IdentifyRequest, IdentifyResponse, ResponseContact } from "../types";

const PRIMARY_PRECEDENCE = "primary";
const SECONDARY_PRECEDENCE = "secondary";

let router = express.Router();

router.post("/",validateInput, async (req: IdentifyRequest, res: Response) => {
  let { email, phoneNumber } = req.body;

  try {
    const result = await findContact(email, phoneNumber);
    console.log(result)
    if (result.length == 0) {
      const savedContact = await saveContact({
        email: email,
        createdAt: new Date().toUTCString(),
        deletedAt: null,
        linkedId: null,
        linkPrecedence: PRIMARY_PRECEDENCE,
        id: null,
        phoneNumber: phoneNumber,
        updatedAt: new Date().toUTCString(),
      });

      let responseBody: ResponseContact = {
        emails: [email],
        phoneNumbers: [phoneNumber],
        primaryContatctId: savedContact.id,
        secondaryContactIds: [],
      };

      let response : IdentifyResponse = {contact : responseBody}
      return res.send(response);
    }

    let contacts = result.filter(
      (i) => i.email == email || i.phoneNumber == phoneNumber
    );
    let primaryMap: number[] = [];
    let primaryContacts: { [key: number]: any } = {};

    contacts.forEach((contact) => {
      if (contact.linkPrecedence === PRIMARY_PRECEDENCE) {
        primaryMap.push(contact.id);
        primaryContacts[contact.id] = contact;
      } else if (!(primaryMap.includes(contact.linkedId!))) {
        // node may secondary node of other chain of contacts
        primaryMap.push(contact.id);
      }
    });

    // max length of primary key can only be 2
    // length == 1 if their is only one chain of contacts
    // 2 if their is colision between two chain of contacts

    if (primaryMap.length == 1) {
      let response : IdentifyResponse = {contact : constructResponse(contacts)}
      return res.send({"contact":response});
    }

    let p1 = primaryContacts[primaryMap[0]];
    let p2 = primaryContacts[primaryMap[1]];

    if (new Date(p1.createdAt) < new Date(p2.createdAt)) {
      p2.set("linkedId",p1.id);
      p2.set("linkPrecedence",SECONDARY_PRECEDENCE);
    } else {
      p1.set("linkedId",p2.id);
      p1.set("linkPrecedence",SECONDARY_PRECEDENCE); ;
    }

    contacts = [p1, p2];
    let response : IdentifyResponse = {contact : constructResponse(contacts)}
    res.send({"contact":response});

    await upsertContact(contacts)
    return ;
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


export default router