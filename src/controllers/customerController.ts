import type { Request, Response } from 'express';

import { prisma } from '../lib/prisma';
import type { CreateCustomerBody } from './customerController.type';
import { t } from '../utils/i18n'

export const createCustomer = async (req: Request, res: Response) => {
  const { document_type, document_number, full_name, email } = req.body as CreateCustomerBody;

  // Required fields: status 400
  if (!document_type || !email) {
    res.status(400).json({
      error: t('errors.bad_request'),
      message: t('errors.customer_missing_fields')
    });
    return;
  }

  try {
    const newCustomer = await prisma.customers.create({
      data: {
        document_type,
        document_number,
        full_name,
        email
      }
    });
    res.status(201).json({
      message: t('success.customer_created'),
      data: newCustomer
    });
  } catch (error: any) {
    // P2002 Prisma code for "Unique constraint failed"
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: t('errors.conflict'),
        message: t('errors.already_exists')
      });
    }
    res.status(500).json({
      error: t('errors.internal_server_error'),
      message: error.message ?? t('errors.customer_created_error')
    });
  }
};

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  const customersList = await prisma.customers.findMany({
    include: { accounts: true },
    orderBy: { created_at: 'desc' }
  });
  res.json(customersList);
};