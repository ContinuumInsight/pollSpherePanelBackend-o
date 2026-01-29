import { Request, Response } from 'express';
import * as clientService from '../services/client.service';
import { sendSuccess } from '../common/response';
import {
  CreateClientInput,
  ListClientsInput,
} from '../schemas/client.schema';
import { AuthRequest } from '../common/types';

// Create client
export const createClient = async (
  req: Request<{}, {}, CreateClientInput>,
  res: Response
): Promise<void> => {
  const authReq = req as AuthRequest;
  const adminEmail = authReq.user!.email;

  const client = await clientService.createClient(req.body, adminEmail);

  sendSuccess(res, client, 'Client created successfully', 201);
};

// List clients
export const listClients = async (
  req: Request<{}, {}, ListClientsInput>,
  res: Response
): Promise<void> => {
  const result = await clientService.listClients(req.body);

  sendSuccess(res, result, 'Clients retrieved successfully');
};

// Get client by ID
export const getClientById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const client = await clientService.getClientById(req.params.id);

  sendSuccess(res, client, 'Client retrieved successfully');
};

// Update client
export const updateClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authReq = req as AuthRequest;
  const adminEmail = authReq.user!.email;

  const client = await clientService.updateClient(
    req.params.id,
    req.body,
    adminEmail
  );

  sendSuccess(res, client, 'Client updated successfully');
};

// Delete client
export const deleteClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authReq = req as AuthRequest;
  const adminEmail = authReq.user!.email;

  await clientService.deleteClient(req.params.id, adminEmail);

  sendSuccess(res, null, 'Client deleted successfully');
};

export default {
  createClient,
  listClients,
  getClientById,
  updateClient,
  deleteClient,
};
