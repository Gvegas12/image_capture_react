import { FC, useEffect, RefObject, memo } from "react";

interface IUIWebcamVideoProps {
  whenOnPlay?: () => void;
  width?: number;
  height?: number;
  videoRef: RefObject<HTMLVideoElement>;
  className?: string;
  getImageCapture?(imageCapture: ImageCapture): void;
}

export const UIWebCamera: FC<IUIWebcamVideoProps> = memo(
  ({ getImageCapture, videoRef }) => {
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const imageCapture = new ImageCapture(stream.getVideoTracks()[0]);
          getImageCapture?.(imageCapture);

          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
          };
        })
        .catch((error) => {
          console.log("getUserMedia error: ", error);
        });

      return () => {
        video.pause();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <video ref={videoRef} autoPlay playsInline />;
  }
);

UIWebCamera.displayName = "UIWebCamera";
