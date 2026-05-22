import ImageKit from 'imagekit';
import { config } from '../config';

class ImageKitService {
  private imagekit: ImageKit | null = null;

  constructor() {
    if (config.imagekit.privateKey && config.imagekit.publicKey) {
      this.imagekit = new ImageKit({
        publicKey: config.imagekit.publicKey,
        privateKey: config.imagekit.privateKey,
        urlEndpoint: config.imagekit.urlEndpoint,
      });
      console.log('[ImageKit] Service initialized successfully.');
    } else {
      console.warn('[ImageKit] Warning: ImageKit credentials missing. Upload signatures will fail.');
    }
  }

  public getAuthParams() {
    if (!this.imagekit) {
      throw new Error('ImageKit client is not initialized due to missing credentials');
    }
    return this.imagekit.getAuthenticationParameters();
  }
}

export const imagekitService = new ImageKitService();
