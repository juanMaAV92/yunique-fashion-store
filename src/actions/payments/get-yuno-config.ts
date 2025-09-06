

'use server';

import { validateYunoConfig, yunoConfig } from '@/lib/yuno';

interface YunoConfigResponse {
  success: boolean;
  data?: {
    apiKey: string;
  };
  error?: string;
}

export const getYunoConfig = async (): Promise<YunoConfigResponse> => {
  try {
    validateYunoConfig();
    
    return {
      success: true,
      data: {
        apiKey: yunoConfig.apiKey,
      }
    };
  } catch (error) {
    console.error('Error getting Yuno config:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get Yuno config',
    };
  }
};