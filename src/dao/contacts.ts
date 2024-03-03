import { Op } from "sequelize";
import { Contact,ContactInstance } from "../models/model";

export async function findContact(
  email: string | undefined,
  phoneNumber: string | undefined
): Promise<ContactInstance[]> {
  try {
    const whereClause: any = {};
    if (email || phoneNumber) {
      whereClause[Op.or] = [];
    }
    if (email) {
      whereClause[Op.or].push({ email });
    }
    if (phoneNumber) {
      whereClause[Op.or].push({ phoneNumber });
    }

    const contacts = await Contact.findAll({
      where: whereClause,
    });

    return contacts;
  } catch (error) {
    console.error("Error during findContact:", error);
    return []
  }
}

export async function saveContact(contact: any): Promise<ContactInstance> {
    let contacts = await Contact.create({
      id: contact.id,
      phoneNumber: contact.phoneNumber,
      email: contact.email,
      linkedId: contact.linkedId,
      linkPrecedence: contact.linkPrecedence,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
      deletedAt: contact.deletedAt,
    });
    return contacts
}

export async function upsertContact(contact: any): Promise<any> {
  try {
    let rows = await Contact.upsert({
      id: contact.id,
      phoneNumber: contact.phoneNumber,
      email: contact.email,
      linkedId: contact.linkedId,
      linkPrecedence: contact.linkPrecedence,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
      deletedAt: contact.deletedAt,
    });
    return rows 
  } catch (error) {
    console.error('Error during contact upsert:', error);
  }
}
