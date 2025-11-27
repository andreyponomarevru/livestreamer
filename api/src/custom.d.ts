declare global {
  namespace Express {
    interface Request {
      // Now in your code your can access it like 'req.tenant'
      tenant?: string;
      validated?: {
        params?: Record<string, unknown>;
        query?: Record<string, unknown>;
        body?: Record<string, unknown>;
        headers?: Record<string, unknown>;
        files?: Record<string, unknown>;
      };
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
