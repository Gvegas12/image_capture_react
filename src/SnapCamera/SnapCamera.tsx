import { FC, RefObject, useEffect, useState } from "react";
import { UIWebCamera } from "../Webcamera";

interface ISnapCameraProps {
  getBase64?(base64: string): void;
  getBlob?(blob: Blob): void;
  videoRef: RefObject<HTMLVideoElement>;
  isSnap: boolean;
}

function blobToBase64Fn(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

const SnapCamera: FC<ISnapCameraProps> = ({
  videoRef,
  getBlob,
  getBase64,
  isSnap = false,
}) => {
  const [imageCapture, setImageCapture] = useState<ImageCapture>();

  useEffect(() => {
    if (isSnap && imageCapture) {
      imageCapture
        .takePhoto()
        .then(async (blob: Blob) => {
          const base64 = await blobToBase64Fn(blob);
          getBase64?.(base64);
          getBlob?.(blob);
        })
        .catch(function (error) {
          console.log("takePhoto() error: ", error);
        });
    }
  }, [getBase64, getBlob, imageCapture, isSnap]);

  return <UIWebCamera getImageCapture={setImageCapture} videoRef={videoRef} />;
};

export default SnapCamera;
