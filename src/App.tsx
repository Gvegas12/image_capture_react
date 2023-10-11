import { useEffect, useRef, useState } from "react";
import "./App.css";
import SnapCamera from "./SnapCamera/SnapCamera";

const contrast = (imageBitmap: ImageBitmap, canvas: HTMLCanvasElement) => {
  console.log("Grabbed frame:", imageBitmap);

  const context = canvas.getContext("2d");

  if (!context) return;

  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  context.drawImage(imageBitmap, 0, 0);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const contrast = 20;

  // Применяем контрастность к каждому пикселю
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;
  }

  context.putImageData(imageData, 0, 0);

  const editedImageSrc = canvas.toDataURL();

  return editedImageSrc;
};

function App() {
  const [isSnap, setIsSnap] = useState(false);
  const [imageCapture, setImageCapture] = useState<ImageCapture>();

  const [base64, setBase64] = useState("");
  const [blob, setBlob] = useState<Blob>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onSnap = () => {
    setIsSnap(true);
  };

  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;

    if (img && imageCapture && canvas && blob) {
      imageCapture.grabFrame().then((imageBitmap) => {
        const editedImageSrc = contrast(imageBitmap, canvas);

        if (editedImageSrc) {
          const link = document.createElement("a");
          link.href = editedImageSrc;
          link.download = "edited_image.png";
          document.body.appendChild(link);
          link.click();
        }
      });

      img.src = URL.createObjectURL(blob);
    }
  }, [base64, blob, imageCapture]);

  return (
    <div className="App">
      <SnapCamera
        getImageCapture={setImageCapture}
        isSnap={isSnap}
        videoRef={videoRef}
        getBase64={setBase64}
        getBlob={setBlob}
      />
      <canvas ref={canvasRef} />
      <button onClick={onSnap}>Snap</button>
      <img ref={imgRef} />
    </div>
  );
}

export default App;

/* if (imageCapture) {
        console.log("2");

        imageCapture
          .grabFrame()
          .then((imageBitmap) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            console.log("3");

            console.log("Grabbed frame [imageBitmap]:", imageBitmap);
            canvas.width = imageBitmap.width;
            canvas.height = imageBitmap.height;
            const contrast = 1.1;
            ctx.filter = `contrast(${contrast})`;
            ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
          })
          .catch(function (error) {
            console.log("grabFrame() error: ", error);
          });
      } */
