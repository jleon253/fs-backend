import type { customers } from '../generated/prisma/client';

export type CreateAccountBody = Pick<customers, 'document_number'>;