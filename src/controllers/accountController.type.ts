import type { customers } from '../generated/prisma/client';

export type CreateAccountBody = Pick<customers, 'document_number'>;

export type CustomerId = Pick<customers, "id">;

export enum EAccountType {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}