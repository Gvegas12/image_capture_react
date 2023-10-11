import { useRef, useState } from "react";
import "./App.css";
import SnapCamera from "./SnapCamera/SnapCamera";

function App() {
  const [base64, setBase64] = useState("");
  const [blob, setBlob] = useState<Blob>();
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onSnap = () => {
    const img = imgRef.current;
    console.log({ base64 });

    if (img && blob) {
      img.src = URL.createObjectURL(blob);
    }
  };

  return (
    <div className="App">
      <p>123asdasdasd</p>
      <SnapCamera
        onSnap={onSnap}
        videoRef={videoRef}
        getBase64={setBase64}
        getBlob={setBlob}
      />
      <img ref={imgRef} />
    </div>
  );
}

export default App;