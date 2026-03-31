import { $ZodIssue } from 'zod/v4/core';

function mapZodErrors(issues: $ZodIssue[]) {
  // biome-ignore lint/suspicious/noExplicitAny: <reason>
  const fieldErrors: Record<string, any> = {};

  issues.forEach((err) => {
    const path = err.path || [];
    if (path.length === 0) return;

    const message = err.message || 'Invalid input';

    // Build nested object structure
    let current = fieldErrors;
    for (let i = 0; i < path.length; i++) {
      const key = String(path[i]);

      // If this is the last path segment, assign the error message
      if (i === path.length - 1) {
        current[key] = message;
      } else {
        // Otherwise, create nested object if it doesn't exist
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
    }
  });

  return fieldErrors;
}

export default mapZodErrors;
