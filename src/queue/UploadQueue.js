import { retryQueue } from './retryQueue';
import { uploadMultipart } from '../api/UploadClient';

export const queueUpload = async (endpoint, formData) => {
  try {
    await uploadMultipart(endpoint, formData);
  } catch {
    await retryQueue.add({ endpoint, formData });
  }
};
