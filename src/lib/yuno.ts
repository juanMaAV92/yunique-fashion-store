// Yuno Payment Gateway Configuration
export const yunoConfig = {
  apiKey: process.env.YUNO_API_KEY || '',
  secretKey: process.env.YUNO_SECRET_KEY || '',
  accountId: process.env.YUNO_ACCOUNT_ID || '',
  environment: process.env.YUNO_ENVIRONMENT || 'sandbox',
  baseUrl: 'https://api-staging.y.uno'
};

// Validate Yuno configuration
export const validateYunoConfig = () => {
  if (!yunoConfig.apiKey) {
    throw new Error('YUNO_API_KEY is required');
  }
  if (!yunoConfig.secretKey) {
    throw new Error('YUNO_SECRET_KEY is required');
  }
  if (!yunoConfig.accountId) {
    throw new Error('YUNO_ACCOUNT_ID is required');
  }
  return true;
};
