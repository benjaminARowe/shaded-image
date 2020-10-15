# shaded-image

> Apply a stack of post-processing style shaders to a static image 

[![NPM](https://img.shields.io/npm/v/shaded-image.svg)](https://www.npmjs.com/package/shaded-image) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save shaded-image
```

## Usage

You can use one of the inbuilt effect components

```jsx
import React from "react";
import {GrayscaleImage} from "shaded-image";

import test from "./download.jpeg";

export default function Example() {
  return (
      <GrayscaleImage
        image={test}
      />
  );
}
```

or create your own effect

```jsx
import React from "react";

import {ShadedImage} from "shaded-image";
/* eslint import/no-webpack-loader-syntax: off */
import * as fragmentShader from "!raw-loader!glslify-loader!./shaders/fragmentGrayscale.glsl";

/* eslint import/no-webpack-loader-syntax: off */
import * as vertexShader from "!raw-loader!glslify-loader!./shaders/vertex.glsl";

export default function GrayscaleImage({ style, className, image }) {
  /* A list of shaders will be applied in order using a framebuffer */
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
```

## License

MIT © [benjaminARowe](https://github.com/benjaminARowe)
