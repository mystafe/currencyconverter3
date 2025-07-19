import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function AssetDownloader() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setFile(f);
  };

  const resizeImage = (file, size) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, size, size);
        canvas.toBlob((blob) => resolve(blob), "image/png");
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const createSvg = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (file.type === "image/svg+xml") {
          resolve(reader.result);
        } else {
          const b64 = reader.result.split(",")[1];
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><image href="data:${file.type};base64,${b64}" width="512" height="512"/></svg>`;
          resolve(svg);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDownload = async () => {
    if (!file) return;
    const [img512, img192, fav32] = await Promise.all([
      resizeImage(file, 512),
      resizeImage(file, 192),
      resizeImage(file, 32),
    ]);
    const svg = await createSvg(file);
    const zip = new JSZip();
    zip.file("logo512.png", img512);
    zip.file("logo192.png", img192);
    zip.file("favicon.ico", fav32);
    zip.file("logo.svg", svg);
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "react-assets.zip");
  };

  return (
    <div className="assetDownloader">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleDownload} disabled={!file}>
        Download React Assets
      </button>
    </div>
  );
}

export default AssetDownloader;
