import { useEffect, useRef, useState } from "react";
import "./App.css";
import SnapCamera from "./SnapCamera/SnapCamera";

// function contrastImage(imgData: ImageData, contrast: number) {
//   //input range [-100..100]
//   const d = imgData.data;
//   contrast = contrast / 100 + 1; //convert to decimal & shift range: [0..2]
//   const intercept = 128 * (1 - contrast);
//   for (let i = 0; i < d.length; i += 4) {
//     //r,g,b,a
//     d[i] = d[i] * contrast + intercept;
//     d[i + 1] = d[i + 1] * contrast + intercept;
//     d[i + 2] = d[i + 2] * contrast + intercept;
//   }
//   return imgData;
// }

function App() {
  const [isSnap, setIsSnap] = useState(false);
  const [base64, setBase64] = useState("");
  const [blob, setBlob] = useState<Blob>();
  const [imageCapture, setImageCapture] = useState<ImageCapture>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onSnap = () => {
    setIsSnap(true);
  };

  useEffect(() => {
    const img = imgRef.current;
    if (img && blob) {
      console.log("1");
      if (imageCapture) {
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
      }

      const anchorEl = document.createElement("a");
      anchorEl.href = base64;
      anchorEl.download = "ic_test_img.jpeg";
      document.body.appendChild(anchorEl);
      anchorEl.click();

      console.log({ base64 });
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
