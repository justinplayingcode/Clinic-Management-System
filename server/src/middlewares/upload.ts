import { IsUploadFor } from "../common/enum/upload";
import { uploadAvatar, uploadTestResult } from "../helper/cloudinary.config";

const upload = (isFor: IsUploadFor, key: string) => {
  switch(isFor) {
    case IsUploadFor.avatar:
      return uploadAvatar.single(key);
    case IsUploadFor.testResult:
      return uploadTestResult.any();
  }
}

export default upload;