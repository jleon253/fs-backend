import { Router } from 'express';
import { createAccount, getAccounts, updateAccountStatus } from '../controllers/accountController';

const router: Router = Router();

router.get('/', getAccounts);
router.post('/', createAccount);
router.patch('/:id/status', updateAccountStatus);

export default router;