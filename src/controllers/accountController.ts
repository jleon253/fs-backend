import type { Request, Response } from "express";

import { prisma } from "../lib/prisma";
import { t } from "../utils/i18n";

import {
  EAccountType,
  type CreateAccountBody,
  type CustomerId,
} from "./accountController.type";

export const createAccount = async (req: Request, res: Response) => {
  const { document_number } = req.body as CreateAccountBody;

  // Required fields: status 400
  if (!document_number) {
    return res.status(400).json({
      error: t("errors.bad_request"),
      message: t("errors.account_missing_fields"),
    });
  }

  try {
    const customerExist = await prisma.customers.findUnique({
      where: { document_number: document_number },
    });

    if (!customerExist) {
      return res.status(404).json({
        error: t("errors.not_found"),
        message: t("errors.customer_not_found", { id: document_number }),
      });
    }

    const newAccount = await prisma.accounts.create({
      data: {
        account_number: 0,
        customer_id: customerExist.id,
        status: EAccountType.ACTIVE,
      },
    });

    res.status(201).json({
      message: t("success.account_created"),
      data: newAccount,
    });
  } catch (error: any) {
    res.status(500).json({
      error: t("errors.internal_server_error"),
      message: error.message ?? t("errors.account_created_error"),
    });
  }
};

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1;
    const limit = Number.parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const documentNumber = req.query.document_number as string;
    const search = req.query.search as string;

    let whereClause = {};

    if (documentNumber) {
      const customer: CustomerId | null = await prisma.customers.findFirst({
        where: { document_number: String(documentNumber) },
        select: { id: true },
      });

      if (!customer) {
        return res.status(404).json({
          error: t("errors.not_found"),
          message: t("errors.customer_not_found", { id: documentNumber }),
        });
      }

      whereClause = { customer_id: customer?.id };
    }

    if (search) {
      const accountNumberInt = Number.parseInt(String(search));
      if (!Number.isNaN(accountNumberInt)) {
        whereClause = {
          ...whereClause,
          account_number: {
            equals: accountNumberInt,
          },
        };
      }
    }

    const [total, data] = await prisma.$transaction([
      prisma.accounts.count({ where: whereClause }),
      prisma.accounts.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: { customers: true },
        orderBy: { created_at: "desc" },
      }),
    ]);

    res.json({
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: t("errors.internal_server_error"),
      message: error.message ?? t("errors.account_created_error"),
    });
  }
};

export const updateAccountStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = [EAccountType.ACTIVE, EAccountType.INACTIVE];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: t("errors.invalid_status") });
  }

  try {
    const updatedAccount = await prisma.accounts.update({
      where: { id: String(id) },
      data: { status: String(status) },
    });

    res.json({
      success: true,
      data: updatedAccount,
    });
  } catch (error: any) {
    res.status(500).json({
      error: t("errors.internal_server_error"),
      message: error.message ?? t("errors.account_update_error"),
    });
  }
};
