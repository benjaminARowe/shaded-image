import React from "react";
import {ShadedImage, GrayscaleImage} from "shaded-image";

import test from "./download.jpeg";

export default function App() {
  return (
    <div className="App">
      <GrayscaleImage
	      style={{ color:"white" }}
        image={test}
      />
    </div>
  );
}
