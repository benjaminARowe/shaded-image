import React from "react";

import ShadedImage from "./ShadedImage";
/* eslint import/no-webpack-loader-syntax: off */
import * as fragmentShader from "!raw-loader!glslify-loader!./shaders/fragmentGrayscale.glsl";

/* eslint import/no-webpack-loader-syntax: off */
import * as vertexShader from "!raw-loader!glslify-loader!./shaders/vertex.glsl";

export default function GrayscaleImage({ style, className, image }) {
  const shaders = [
    {
      vertexShader: vertexShader.default,
      fragmentShader: fragmentShader.default,
      initFunction: (args) => {},
      updateFunction: (args) => {},
    }
  ];
  return (
    <div className="App">
      <ShadedImage
        style={style}
        className={className}
        shaders={shaders}
        image={image}
      />
    </div>
  );
}
