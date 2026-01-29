import { Router } from 'express';
import * as clientController from '../controllers/client.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequest } from '../middleware/validateRequest';
import {
  createClientSchema,
  listClientsSchema,
  getClientByIdSchema,
  updateClientSchema,
  deleteClientSchema,
} from '../schemas/client.schema';

const router = Router();

// All client routes require authentication and super_admin or finance_manager role
const clientAuthorization = [authenticate, authorize('super_admin', 'finance_manager')];

// Create client
router.post(
  '/create',
  clientAuthorization,
  validateRequest(createClientSchema),
  asyncHandler(clientController.createClient)
);

// List clients with filters
router.post(
  '/listClients',
  clientAuthorization,
  validateRequest(listClientsSchema),
  asyncHandler(clientController.listClients)
);

// Get client by ID
router.get(
  '/:id',
  clientAuthorization,
  validateRequest(getClientByIdSchema),
  asyncHandler(clientController.getClientById)
);

// Update client
router.put(
  '/update/:id',
  clientAuthorization,
  validateRequest(updateClientSchema),
  asyncHandler(clientController.updateClient)
);

// Delete client
router.delete(
  '/delete/:id',
  clientAuthorization,
  validateRequest(deleteClientSchema),
  asyncHandler(clientController.deleteClient)
);

export default router;
