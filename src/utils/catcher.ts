import {logger} from './logger';

const catcher = (e: any) => {
  logger.error(e);
  if (e.response && e.response.data) {
    return e.response.data.error;
  }
  if (e.message) {
    return e.message;
  }
  return null;
};

export default catcher;
