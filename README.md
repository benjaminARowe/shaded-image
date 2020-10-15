# shaded-image

> Apply a stack of post-processing style shaders to a static image 

[![NPM](https://img.shields.io/npm/v/shaded-image.svg)](https://www.npmjs.com/package/shaded-image) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save shaded-image
```

## Usage

### Inbuilt Components
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

### Custom Effects
You can create your own custom effects by defining a glsl fragment and vertex shader. Uniform and Varying values can be set using initFunction and updateFunction

#### vertex.glsl
```glsl
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

varying highp vec2 vTextureCoord;

void main(void) {
	gl_Position =  vec4(aVertexPosition, 1.0);
	vTextureCoord = aTextureCoord;
}

```

#### fragmentGrayscale.glsl
```glsl
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
	lowp vec4 tex = texture2D(uSampler, vTextureCoord);
	lowp float col = (0.2126 * tex.r + 0.7152 * tex.g + 0.0722*tex.b);
	gl_FragColor = vec4(col, col, col, tex.a);
}

```

#### GrayscaleImage.js
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
