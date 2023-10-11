import { FC, RefObject } from "react";
import { UIWebCamera } from "../Webcamera";

interface ISnapCameraProps {
  getBase64?(base64: string): void;
  getBlob?(blob: Blob): void;
  videoRef: RefObject<HTMLVideoElement>;
  onSnap(): void;
}

function blobToBase64Fn(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

function getData(
  imageCapture: ImageCapture
): Promise<{ base64: string; blob: Blob }> {
  return new Promise((res) => {
    imageCapture
      .takePhoto()
      .then(async (blob: Blob) => {
        console.log("Took photo: ", blob);
        const base64 = await blobToBase64Fn(blob);
        res({ base64, blob });
      })
      .catch(function (error) {
        console.log("takePhoto() error: ", error);
      });
  });
}

async function takePhoto(
  imageCapture: ImageCapture,
  getBlob: ISnapCameraProps["getBlob"],
  getBase64: ISnapCameraProps["getBase64"]
): Promise<void> {
  const { base64, blob } = await getData(imageCapture);
  getBlob?.(blob);
  getBase64?.(base64);
}

const SnapCamera: FC<ISnapCameraProps> = ({
  videoRef,
  onSnap,
  getBlob,
  getBase64,
}) => (
  <>
    <UIWebCamera
      getImageCapture={(ic) => takePhoto(ic, getBlob, getBase64)}
      videoRef={videoRef}
    />
    <button onClick={onSnap}>Snap</button>
  </>
);

export default SnapCamera;
