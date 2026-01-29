import Client, { IClient } from '../models/Client';
import { FilterQuery, UpdateQuery } from 'mongoose';

interface ListClientsOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ListClientsResult {
  clients: IClient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const create = async (clientData: Partial<IClient>): Promise<IClient> => {
  const client = new Client(clientData);
  return await client.save();
};

export const findById = async (id: string): Promise<IClient | null> => {
  return await Client.findById(id);
};

export const findByEmail = async (email: string): Promise<IClient | null> => {
  return await Client.findOne({ email: email.toLowerCase() });
};

export const existsByEmail = async (email: string): Promise<boolean> => {
  const count = await Client.countDocuments({ email: email.toLowerCase() });
  return count > 0;
};

export const updateById = async (
  id: string,
  updateData: UpdateQuery<IClient>
): Promise<IClient | null> => {
  return await Client.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteById = async (id: string): Promise<IClient | null> => {
  return await Client.findByIdAndDelete(id);
};

export const listClients = async (
  options: ListClientsOptions
): Promise<ListClientsResult> => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const skip = (page - 1) * limit;

  // Build filter query
  const filter: FilterQuery<IClient> = {};

  // Search filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { 'companyInfo.companyName': { $regex: search, $options: 'i' } },
    ];
  }

  // Status filter
  if (status) {
    filter.status = status;
  }

  // Sort options
  const sortOptions: any = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query
  const [clients, total] = await Promise.all([
    Client.find(filter).sort(sortOptions).skip(skip).limit(limit),
    Client.countDocuments(filter),
  ]);

  return {
    clients,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const findAll = async (): Promise<IClient[]> => {
  return await Client.find();
};

export const countByStatus = async (status: string): Promise<number> => {
  return await Client.countDocuments({ status });
};

export default {
  create,
  findById,
  findByEmail,
  existsByEmail,
  updateById,
  deleteById,
  listClients,
  findAll,
  countByStatus,
};
