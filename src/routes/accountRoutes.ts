import { Router } from 'express';
import { createAccount, getAccounts } from '../controllers/accountController';

const router: Router = Router();

router.get('/', getAccounts);
router.post('/', createAccount);

export default router;