import jwt from 'jsonwebtoken';

export const generateToken = (userId: number, email: string): string => {
  const secret = process.env.JWT_SECRET || '';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ userId, email }, secret, { expiresIn } as any);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET || '');
};
