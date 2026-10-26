import axios from "axios";

class AwsUploadService {
  async uploadToS3(presignedUrl, file, onProgress = () => {}) {
    return axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      timeout: 300_000,
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;

        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        onProgress(percentCompleted);
      },
    });
  }
}

export const awsUploadService = new AwsUploadService();
