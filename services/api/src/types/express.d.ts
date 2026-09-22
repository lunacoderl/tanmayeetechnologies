// ============================================================================
// Express Type Augmentations
// ============================================================================

import 'express';
import { AdminRole } from '@tanmayee/config';

export interface AuthUser {
  id: string;
  email: string;
  role: AdminRole;
  fullName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      sessionId?: string;
    }
  }
}

declare module 'express-serve-static-core' {
  interface ParamsDictionary {
    [key: string]: any;
  }
}
