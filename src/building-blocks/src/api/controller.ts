import { Router } from 'express';

export interface Controller {
  route: string;

  getRouter(): Router;
}
