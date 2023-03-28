import {logger} from './logger';

export const catcher = (e: any) => {
  logger.error(e);
  if (e.response && e.response.data) {
    return e.response.data.error;
  }
  if (e.message) {
    return e.message;
  }
  return null;
};
