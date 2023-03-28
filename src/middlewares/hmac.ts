import {NextFunction} from 'express';

import {logger} from '../utils/logger';

export const hmacMiddleware = (_req: any, _res: any, next: NextFunction) => {
  logger.info('hmacMiddleware');
  next();
};
