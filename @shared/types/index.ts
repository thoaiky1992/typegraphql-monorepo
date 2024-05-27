import { BaseContext } from '@apollo/server';
import { NextFunction, Request, Response } from 'express';

export type ApoloContextType = BaseContext & {
  req: Request;
  res: Response;
};

export type ExpressMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'USE' | 'ALL';
export type ExpressMiddleawareHandler = (req?: Request, res?: Response, next?: NextFunction) => void;
export type ApoloMiddlewareType = {
  [key: string]: {
    [key in ExpressMethod]?: ExpressMiddleawareHandler[];
  };
};

export type contextBuilderType = { req: Request; res: Response };
