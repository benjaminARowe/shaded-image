# shaded-image

Apply a stack of post-processing style shaders to a static image

> **Note**
> When using React, I recommend using the React component wrapper [shaded-image-react](https://www.npmjs.com/package/shaded-image-react)

[![NPM](https://img.shields.io/npm/v/shaded-image.svg)](https://www.npmjs.com/package/shaded-image) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install shaded-image
```

## Usage

### Inbuilt Components

You can use one of the inbuilt effect components

```html
<head>
  <script type="module">
    import "shaded-image";
  </script>
</head>
<body>
  <div style="display: flex">
    <si-greyscale-image image="./image.svg" class="logo" />
  </div>
</body>
```

```html
<head>
  <script type="module">
    import "shaded-image";
  </script>
</head>
<body>
  <div style="display: flex">
    <si-anim-test-image image="./image.svg" class="logo" />
  </div>
</body>
`;
```

### Custom Effects

You can create your own custom effects by defining a glsl fragment and vertex shader. Uniform and Varying values can be set using initFunction and updateFunction

#### GrayscaleImage.js

```html
<head>
  <script type="module">
    import "shaded-image";
    const fragmentShader = `
      varying highp vec2 vTextureCoord;
      uniform sampler2D uSampler;

      void main(void) {
      	lowp vec4 tex = texture2D(uSampler, vTextureCoord);
      	lowp float col = (0.2126 * tex.r + 0.7152 * tex.g + 0.0722*tex.b);
      	gl_FragColor = vec4(col, col, col, tex.a);
      }

      `;
    const vertexShader = `
      attribute vec3 aVertexPosition;
      attribute vec2 aTextureCoord;

      varying highp vec2 vTextureCoord;

      void main(void) {
      	gl_Position =  vec4(aVertexPosition.xy, 0.0, 1.0);
      	vTextureCoord = aTextureCoord;
      }
    `;
    const shaders = [
      {
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        initFunction: (args) => {},
        updateFunction: (args) => {},
      },
    ];

    const greyImage = document.querySelector("#example");
    greyImage.shaders = shaders;
  </script>
</head>
<body>
  <div style="display: flex">
    <si-shaded-image id="example" image="./image.svg" class="logo" />
  </div>
</body>
```

## License

MIT © [benjaminARowe](https://github.com/benjaminARowe)
