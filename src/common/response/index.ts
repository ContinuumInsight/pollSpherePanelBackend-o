import { Response } from 'express';
import { HTTP_STATUS } from '../constants';

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = HTTP_STATUS.OK
): Response<SuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string = 'Error',
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors?: any
): Response<ErrorResponse> => {
  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = 'Created successfully'
): Response<SuccessResponse<T>> => {
  return sendSuccess(res, data, message, HTTP_STATUS.CREATED);
};

export const sendNoContent = (res: Response): Response => {
  return res.status(HTTP_STATUS.NO_CONTENT).send();
};

export default {
  sendSuccess,
  sendError,
  sendCreated,
  sendNoContent,
};
