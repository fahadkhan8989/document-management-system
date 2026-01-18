import { UnauthorizedError, NotFoundError } from './errors';

export const verifyDocumentOwnership = (document: any, userId: number): void => {
  if (document.userId !== userId) {
    throw new UnauthorizedError();
  }
};

export function ensureResourceExists<T>(resource: T | null | undefined, resourceName: string): asserts resource is T {
  if (!resource) {
    throw new NotFoundError(`${resourceName} not found`);
  }
}
