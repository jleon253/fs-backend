import type { Request, Response } from 'express';

import { prisma } from '../lib/prisma';
import type { CreateAccountBody } from './accountController.type';
import { t } from '../utils/i18n'

export const createAccount = async (req: Request, res: Response) => {
  const { document_number } = req.body as CreateAccountBody;

  // Required fields: status 400
  if (!document_number) {
    return res.status(400).json({
      error: t('errors.bad_request'),
      message: t('errors.account_missing_fields')
    });
  }

  try {
    // Check if customer exists by document_number
    const customerExist = await prisma.customers.findUnique({
      where: { document_number: document_number }
    });

    // If customer doesn't exist, return 404
    if (!customerExist) {
      return res.status(404).json({
        error: t('errors.not_found'),
        message: t('errors.customer_not_found', { id: document_number })
      });
    }

    // Create account linked to the customer
    const newAccount = await prisma.accounts.create({
      data: {
        account_number: 0,
        customer_id: customerExist.id,
        status: 'ACTIVE'
      }
    });

    res.status(201).json({
      message: t('success.account_created'),
      data: newAccount
    });

  } catch (error: any) {
    res.status(500).json({
      error: t('errors.internal_server_error'),
      message: error.message ?? t('errors.account_created_error')
    });
  }
};

export const getAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const accountsList = await prisma.accounts.findMany({
      include: { customers: true },
      orderBy: { created_at: 'desc' }
    });
    res.json(accountsList);
  } catch (error: any) {
    res.status(500).json({
      error: t('errors.internal_server_error'),
      message: error.message ?? t('errors.account_created_error')
    });
  }
};