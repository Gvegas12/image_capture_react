import { useEffect, useRef, useState } from "react";
import "./App.css";
import SnapCamera from "./SnapCamera/SnapCamera";

function App() {
  const [isSnap, setIsSnap] = useState(false);
  const [base64, setBase64] = useState("");
  const [blob, setBlob] = useState<Blob>();

  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onSnap = () => {
    setIsSnap(true);
  };

  useEffect(() => {
    const img = imgRef.current;
    if (img && blob) {
      const anchorEl = document.createElement("a");
      anchorEl.href = base64;
      anchorEl.download = "ic_test_img.jpeg";
      document.body.appendChild(anchorEl);
      anchorEl.click();

      console.log({ base64 });
      img.src = URL.createObjectURL(blob);
    }
  }, [base64, blob]);

  return (
    <div className="App">
      <SnapCamera
        isSnap={isSnap}
        videoRef={videoRef}
        getBase64={setBase64}
        getBlob={setBlob}
      />
      <button onClick={onSnap}>Snap</button>
      <img ref={imgRef} />
    </div>
  );
}

export default App;
