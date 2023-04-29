import React from 'react'

import ShadedImage from './ShadedImage'

export default function GrayscaleImage({ style, className, image }) {
  const fragmentShader = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;
    
    void main(void) {
    	lowp vec4 tex = texture2D(uSampler, vTextureCoord);
    	lowp float col = (0.2126 * tex.r + 0.7152 * tex.g + 0.0722*tex.b);
    	gl_FragColor = vec4(col, col, col, tex.a);
    }
    
    `
  const vertexShader = `
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;
    
    varying highp vec2 vTextureCoord;
    
    void main(void) {
    	gl_Position =  vec4(aVertexPosition.xy, 0.0, 1.0);
    	vTextureCoord = aTextureCoord;
    }

  `
  const shaders = [
    {
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      initFunction: (args) => {},
      updateFunction: (args) => {}
    }
  ]
  return (
    <div className='App'>
      <ShadedImage
        style={style}
        className={className}
        shaders={shaders}
        image={image}
      />
    </div>
  )
}
