import Filter, { IFilter, ICountry, IVendorFilter, IClientFilter } from '../models/Filter';
import { SURVEY_STATUS } from '../common/constants/surveyStatus';

// Get or create the single filter document
export const getOrCreateFilter = async (): Promise<IFilter> => {
  let filter = await Filter.findOne();
  
  if (!filter) {
    // Create initial filter with default gender and status values
    filter = await Filter.create({
      countries: [],
      vendors: [],
      gender: ['MALE', 'FEMALE', 'OTHER'],
      clients: [],
      status: [...SURVEY_STATUS],
    });
  }
  
  return filter;
};

// Get all filters
export const getAll = async (): Promise<IFilter> => {
  return await getOrCreateFilter();
};

// Add or update countries
export const addOrUpdateCountries = async (countries: ICountry[]): Promise<IFilter> => {
  const filter = await getOrCreateFilter();
  
  // Merge countries - update existing or add new
  countries.forEach((newCountry) => {
    const existingIndex = filter.countries.findIndex(
      (c) => c.isoCode === newCountry.isoCode
    );
    
    if (existingIndex >= 0) {
      filter.countries[existingIndex] = newCountry;
    } else {
      filter.countries.push(newCountry);
    }
  });
  
  return await filter.save();
};

// Add or update vendor
export const addOrUpdateVendor = async (vendor: IVendorFilter): Promise<IFilter> => {
  const filter = await getOrCreateFilter();
  
  const existingIndex = filter.vendors.findIndex(
    (v) => v.vendorId === vendor.vendorId
  );
  
  if (existingIndex >= 0) {
    filter.vendors[existingIndex] = vendor;
  } else {
    filter.vendors.push(vendor);
  }
  
  return await filter.save();
};

// Remove vendor
export const removeVendor = async (vendorId: string): Promise<IFilter> => {
  const filter = await getOrCreateFilter();
  
  filter.vendors = filter.vendors.filter((v) => v.vendorId !== vendorId);
  
  return await filter.save();
};

// Add or update client
export const addOrUpdateClient = async (client: IClientFilter): Promise<IFilter> => {
  const filter = await getOrCreateFilter();
  
  const existingIndex = filter.clients.findIndex(
    (c) => c.clientId === client.clientId
  );
  
  if (existingIndex >= 0) {
    filter.clients[existingIndex] = client;
  } else {
    filter.clients.push(client);
  }
  
  return await filter.save();
};

// Remove client
export const removeClient = async (clientId: string): Promise<IFilter> => {
  const filter = await getOrCreateFilter();
  
  filter.clients = filter.clients.filter((c) => c.clientId !== clientId);
  
  return await filter.save();
};

// Remove country
export const removeCountry = async (isoCode: string): Promise<IFilter> => {
  const filter = await getOrCreateFilter();
  
  filter.countries = filter.countries.filter((c) => c.isoCode !== isoCode);
  
  return await filter.save();
};

export default {
  getOrCreateFilter,
  getAll,
  addOrUpdateCountries,
  addOrUpdateVendor,
  removeVendor,
  addOrUpdateClient,
  removeClient,
  removeCountry,
};
