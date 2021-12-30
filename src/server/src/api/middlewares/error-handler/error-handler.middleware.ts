/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AppError,
  BusinessRuleValidationError,
  InputValidationError,
  Logger,
  NotFoundError,
  ResourceAlreadyExistsError,
  UnauthenticatedError,
  UnauthorizedError,
} from '@krater/building-blocks';
import { CelebrateError, isCelebrateError } from 'celebrate';
import { ErrorRequestHandler } from 'express';

export const errorHandlerMiddleware =
  (logger: Logger): ErrorRequestHandler =>
  (error, _, res, next) => {
    logger.error(`[API Error] ${error.toString()}`);

    if (Object.keys(res.locals).length) {
      logger.error(`Error context:\n${JSON.stringify(res.locals, null, 2)}\n`);
    }

    const errorName = error.name;

    if (isCelebrateError(error)) {
      const celebrateError =
        (error as CelebrateError).details.get('body') ||
        (error as CelebrateError).details.get('query') ||
        (error as CelebrateError).details.get('params');

      return res.status(422).json({
        error: InputValidationError.name,
        message: celebrateError?.message,
        details: celebrateError?.details.map((detail) => ({
          key: detail.context?.key,
          message: detail.message,
        })),
      });
    }

    switch (errorName) {
      case AppError.name:
      default:
        logger.error(`Stack: ${error.stack}`);
        return res.status(error.errorCode ?? 500).json({
          error: error.message,
          name: error.name,
        });

      case InputValidationError.name:
        return res.status(422).json({
          error: error.message,
          name: error.name,
        });

      case BusinessRuleValidationError.name:
        return res.status(400).json({
          error: error.message,
          name: error.name,
        });

      case NotFoundError.name:
        return res.status(404).json({
          error: error.message,
          name: error.name,
        });

      case UnauthorizedError.name:
        return res.status(401).json({
          error: error.message,
          name: error.name,
        });

      case UnauthenticatedError.name:
        return res.status(403).json({
          error: error.message,
          name: error.name,
        });

      case ResourceAlreadyExistsError.name:
        return res.status(409).json({
          error: error.message,
          name: error.name,
        });
    }
  };
