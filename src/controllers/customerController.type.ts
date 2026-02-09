import type { customers } from '../generated/prisma/client';

export type CreateCustomerBody = Pick<customers, 'document_type' | 'document_number' | 'full_name' | 'email'>;

