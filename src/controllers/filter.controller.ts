import { Request, Response } from 'express';
import * as filterService from '../services/filter.service';
import { sendSuccess } from '../common/response';
import { AddOrUpdateCountriesInput, RemoveItemInput } from '../schemas/filter.schema';

// Get all filters
export const getAllFilters = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const filters = await filterService.getAllFilters();

  sendSuccess(res, filters, 'Filters retrieved successfully');
};

// Add or update countries
export const addOrUpdateCountries = async (
  req: Request<{}, {}, AddOrUpdateCountriesInput>,
  res: Response
): Promise<void> => {
  const filters = await filterService.addOrUpdateCountries(req.body);

  sendSuccess(res, filters, 'Countries updated successfully');
};

// Remove item from filters
export const removeItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { type, id } = req.query as RemoveItemInput;

  const filters = await filterService.removeItem(type, id);

  sendSuccess(res, filters, `${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully`);
};

export default {
  getAllFilters,
  addOrUpdateCountries,
  removeItem,
};
