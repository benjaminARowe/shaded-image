# shaded-image

> Apply a stack of post-processing style shaders to a static image 

[![NPM](https://img.shields.io/npm/v/shaded-image.svg)](https://www.npmjs.com/package/shaded-image) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save shaded-image
```

## Usage

```jsx
import React from "react";
import {ShadedImage, GrayscaleImage} from "shaded-image";

import test from "./download.jpeg";

export default function Example() {
  return (
    <div className="Example">
      <GrayscaleImage
        image={test}
      />
    </div>
  );
}
```

## License

MIT © [benjaminARowe](https://github.com/benjaminARowe)
