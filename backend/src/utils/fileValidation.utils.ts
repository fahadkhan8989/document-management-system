const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

const FILE_EXTENSIONS: { [key: string]: string } = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain': 'txt',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

export const isValidFileType = (mimeType: string): boolean => {
  return ALLOWED_FILE_TYPES.includes(mimeType);
};

export const getFileExtension = (mimeType: string): string => {
  return FILE_EXTENSIONS[mimeType] || '';
};

export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760');
