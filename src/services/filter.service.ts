import * as filterRepository from '../repositories/filter.repository';
import {
  FilterResponseDTO,
  AddOrUpdateCountriesDTO,
  VendorFilterDTO,
  ClientFilterDTO,
} from '../dtos/filter.dto';
import { IFilter } from '../models/Filter';
import logger from '../common/utils/logger';
import { NotFoundError } from '../common/errors';

// Format filter response
const formatFilterResponse = (filter: IFilter): FilterResponseDTO => {
  return {
    id: filter._id.toString(),
    countries: filter.countries,
    vendors: filter.vendors,
    gender: filter.gender,
    clients: filter.clients,
    status: filter.status,
    createdAt: filter.createdAt,
    updatedAt: filter.updatedAt,
  };
};

// Get all filters
export const getAllFilters = async (): Promise<FilterResponseDTO> => {
  const filter = await filterRepository.getAll();
  return formatFilterResponse(filter);
};

// Add or update countries
export const addOrUpdateCountries = async (
  data: AddOrUpdateCountriesDTO
): Promise<FilterResponseDTO> => {
  const filter = await filterRepository.addOrUpdateCountries(data.countries);
  
  logger.info(`Countries updated in filters`);
  
  return formatFilterResponse(filter);
};

// Sync vendor to filters (called from vendor service)
export const syncVendor = async (vendorData: VendorFilterDTO): Promise<void> => {
  await filterRepository.addOrUpdateVendor(vendorData);
  logger.info(`Vendor synced to filters: ${vendorData.vendorId}`);
};

// Remove vendor from filters (called from vendor service)
export const removeVendorFromFilters = async (vendorId: string): Promise<void> => {
  await filterRepository.removeVendor(vendorId);
  logger.info(`Vendor removed from filters: ${vendorId}`);
};

// Sync client to filters (called from client service)
export const syncClient = async (clientData: ClientFilterDTO): Promise<void> => {
  await filterRepository.addOrUpdateClient(clientData);
  logger.info(`Client synced to filters: ${clientData.clientId}`);
};

// Remove client from filters (called from client service)
export const removeClientFromFilters = async (clientId: string): Promise<void> => {
  await filterRepository.removeClient(clientId);
  logger.info(`Client removed from filters: ${clientId}`);
};

// Remove item from filters
export const removeItem = async (type: string, id: string): Promise<FilterResponseDTO> => {
  let filter: IFilter;
  
  if (type === 'country') {
    filter = await filterRepository.removeCountry(id);
    logger.info(`Country removed from filters: ${id}`);
  } else if (type === 'vendor') {
    filter = await filterRepository.removeVendor(id);
    logger.info(`Vendor removed from filters: ${id}`);
  } else if (type === 'client') {
    filter = await filterRepository.removeClient(id);
    logger.info(`Client removed from filters: ${id}`);
  } else {
    throw new NotFoundError('Invalid type specified');
  }
  
  return formatFilterResponse(filter);
};

export default {
  getAllFilters,
  addOrUpdateCountries,
  syncVendor,
  removeVendorFromFilters,
  syncClient,
  removeClientFromFilters,
  removeItem,
};
