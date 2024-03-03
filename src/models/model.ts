// models/contact.js
import { DataTypes, Model } from "sequelize";
import pool from "../db";

export interface ContactAttributes {
  id: number;
  phoneNumber: string | null;
  email: string | null;
  linkedId: number | null;
  linkPrecedence: 'primary' | 'secondary';
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ContactInstance extends Model<ContactAttributes>, ContactAttributes {}


export const Contact = pool.define<ContactInstance>("Contact", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  linkedId: {
    type: DataTypes.INTEGER,
  },
  linkPrecedence: {
    type: DataTypes.ENUM("primary", "secondary"),
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
});

