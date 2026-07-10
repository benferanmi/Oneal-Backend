import { cloudinary } from "../config/cloudinary";
import { env } from "../config/env";
import { AppError } from "../utils/errors";

class FileUploadServiceImpl {
  generateSignature(folder = "oneals/leads") {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
      timestamp,
      folder,
    };
    
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      env.CLOUDINARY_API_SECRET
    );
    
    return {
      timestamp,
      signature,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      folder
    };
  }

  async deletePhoto(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}

export const FileUploadService = new FileUploadServiceImpl();
