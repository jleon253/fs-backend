import { Router } from 'express';
import { getCustomers, createCustomer } from '../controllers/customerController';

const router: Router = Router();

router.get('/', getCustomers);
router.post('/', createCustomer);

export default router;