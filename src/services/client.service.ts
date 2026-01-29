import * as clientRepository from '../repositories/client.repository';
import {
  CreateClientDTO,
  UpdateClientDTO,
  ClientResponseDTO,
  ListClientsQueryDTO,
  ListClientsResponseDTO,
} from '../dtos/client.dto';
import { ConflictError, NotFoundError } from '../common/errors';
import { IClient } from '../models/Client';
import logger from '../common/utils/logger';
import * as filterService from './filter.service';

// Format client response
const formatClientResponse = (client: IClient): ClientResponseDTO => {
  return {
    id: client._id.toString(),
    name: client.name,
    email: client.email,
    phone: client.phone,
    companyInfo: client.companyInfo,
    address: client.address,
    status: client.status,
    createdBy: client.createdBy,
    updatedBy: client.updatedBy,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  };
};

// Create client
export const createClient = async (
  clientData: CreateClientDTO,
  adminEmail: string
): Promise<ClientResponseDTO> => {
  // Check if client with email already exists
  const existingClient = await clientRepository.findByEmail(clientData.email);
  if (existingClient) {
    throw new ConflictError('Client with this email already exists');
  }

  // Create client with admin email
  const client = await clientRepository.create({
    ...clientData,
    createdBy: adminEmail,
    updatedBy: adminEmail,
  });

  logger.info(`Client created: ${client.email} by ${adminEmail}`);

  // Sync client to filters
  await filterService.syncClient({
    clientId: client._id.toString(),
    clientName: client.name,
    clientCurrency: [], // Clients don't have currency array in the model
  });

  return formatClientResponse(client);
};

// Get client by ID
export const getClientById = async (id: string): Promise<ClientResponseDTO> => {
  const client = await clientRepository.findById(id);

  if (!client) {
    throw new NotFoundError('Client not found');
  }

  return formatClientResponse(client);
};

// Update client
export const updateClient = async (
  id: string,
  updateData: UpdateClientDTO,
  adminEmail: string
): Promise<ClientResponseDTO> => {
  // Check if client exists
  const existingClient = await clientRepository.findById(id);
  if (!existingClient) {
    throw new NotFoundError('Client not found');
  }

  // If email is being updated, check if new email is already in use
  if (updateData.email && updateData.email !== existingClient.email) {
    const emailExists = await clientRepository.existsByEmail(updateData.email);
    if (emailExists) {
      throw new ConflictError('Client with this email already exists');
    }
  }

  // Build update object with proper nested field handling
  const updateObject: any = {
    updatedBy: adminEmail,
  };

  // Update top-level fields
  if (updateData.name !== undefined) updateObject.name = updateData.name;
  if (updateData.email !== undefined) updateObject.email = updateData.email;
  if (updateData.phone !== undefined) updateObject.phone = updateData.phone;
  if (updateData.status !== undefined) updateObject.status = updateData.status;

  // Update nested fields - merge with existing data
  if (updateData.companyInfo) {
    updateObject.companyInfo = {
      ...existingClient.companyInfo,
      ...updateData.companyInfo,
    };
  }

  if (updateData.address) {
    updateObject.address = {
      ...existingClient.address,
      ...updateData.address,
    };
  }

  // Update client
  const updatedClient = await clientRepository.updateById(id, updateObject);

  if (!updatedClient) {
    throw new NotFoundError('Client not found after update');
  }

  logger.info(`Client updated: ${updatedClient.email} by ${adminEmail}`);

  // Sync updated client to filters
  await filterService.syncClient({
    clientId: updatedClient._id.toString(),
    clientName: updatedClient.name,
    clientCurrency: [], // Clients don't have currency array in the model
  });

  return formatClientResponse(updatedClient);
};

// Delete client
export const deleteClient = async (
  id: string,
  adminEmail: string
): Promise<void> => {
  const client = await clientRepository.findById(id);

  if (!client) {
    throw new NotFoundError('Client not found');
  }

  await clientRepository.deleteById(id);

  logger.info(`Client deleted: ${client.email} by ${adminEmail}`);

  // Remove client from filters
  await filterService.removeClientFromFilters(id);
};

// List clients with filters
export const listClients = async (
  query: ListClientsQueryDTO
): Promise<ListClientsResponseDTO> => {
  const result = await clientRepository.listClients(query);

  return {
    clients: result.clients.map(formatClientResponse),
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
  };
};

export default {
  createClient,
  getClientById,
  updateClient,
  deleteClient,
  listClients,
};
