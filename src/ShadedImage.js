import { useRef, useState, useEffect } from 'react'
import React from 'react'
import {
  compileShader,
  createProgram,
  initBuffers,
  bindBuffers,
  loadTexture,
  textureFromData
} from './shaderUtils'

export default function ShadedImage({
  style,
  className,
  shaders,
  image,
  textureData,
  values
}) {
  const [value, setValue] = useState(0) // integer state
  function init(canvas, gl) {
    /**
     * Provides requestAnimationFrame in a cross browser way.
     * paulirish.com/2011/requestanimationframe-for-smart-animating/
     */
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LESS)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    return gl
  }

  function resizeCanvas(canvas, gl) {
    if (
      canvas.width !== canvas.clientWidth ||
      canvas.height !== canvas.clientHeight
    ) {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight

      gl.viewport(0, 0, canvas.width, canvas.height)
    }
  }

  function createShaders(gl, shaders) {
    let compiledShaders = shaders.map((shader) => {
      console.log(shader.vertexShader)
      let vertexShader = compileShader(
        gl,
        shader.vertexShader,
        gl.VERTEX_SHADER
      )
      let fragmentShader = compileShader(
        gl,
        shader.fragmentShader,
        gl.FRAGMENT_SHADER
      )

      let shaderProgram = createProgram(gl, vertexShader, fragmentShader)

      return {
        program: shaderProgram,
        initFunction: shader.initFunction,
        updateFunction: shader.updateFunction
      }
    })
    return compiledShaders
  }

  function animate(canvas, gl, shaders, texture, buffers) {
    resizeCanvas(canvas, gl)
    render(gl, canvas, shaders, texture, buffers)
  }

  function render(gl, canvas, shaders, texture, buffers) {
    gl.bindTexture(gl.TEXTURE_2D, texture.texture)

    for (let [i, currentProgram] of shaders.entries()) {
      if (!currentProgram) return

      // // Load program into GPU
      gl.useProgram(currentProgram.program)
      currentProgram.updateFunction({
        program: currentProgram.program,
        context: gl,
        canvas: canvas,
        values: values
      })

      // Bind buffers to the current program
      bindBuffers(gl, currentProgram.program, buffers)

      if (i == shaders.length - 1) {
        // render to the canvas
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      }

      // Draw the data from our buffers
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
      console.log('Manually Rerendering')
      setValue((value) => value + 1) // update the state to force render
    }
  }

  const canvasRef = useRef()
  //const [texture, setTexture] = useState(null)

  useEffect(() => {
    let canvas = canvasRef.current
    console.log(canvas)
    // Initialize our gl context
    let gl = canvas.getContext('webgl')
    init(canvas, gl)
    console.log(shaders)
    let compiledShaders = createShaders(gl, shaders)

    for (let shader of compiledShaders) {
      gl.useProgram(shader.program)
      shader.initFunction({
        program: shader.program,
        context: gl,
        canvas: canvas,
        values: values
      })
    }

let texture = null;

    if (image != null) {
      console.log('Using Image')
      loadTexture(gl, image, (t) => {
	texture = t;
        if (texture != null) {
          const fb = gl.createFramebuffer()

          gl.bindFramebuffer(gl.FRAMEBUFFER, fb)

          // attach the texture as the first color attachment
          const attachmentPoint = gl.COLOR_ATTACHMENT0
          gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            attachmentPoint,
            gl.TEXTURE_2D,
            texture.texture,
            0
          )

          let buffers = initBuffers(gl)
          animate(canvas, gl, compiledShaders, texture, buffers)
        }
      })
    } else if (textureData != null) {
	let texture = textureFromData(
          gl,
          textureData.width,
          textureData.height,
          textureData.data
        )
      console.log(textureData)
	console.log(texture);
      if (texture != null) {
        console.log('Using Data Image')
        const fb = gl.createFramebuffer()

        gl.bindFramebuffer(gl.FRAMEBUFFER, fb)

        // attach the texture as the first color attachment
        const attachmentPoint = gl.COLOR_ATTACHMENT0
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          attachmentPoint,
          gl.TEXTURE_2D,
          texture.texture,
          0
        )

        let buffers = initBuffers(gl)
        animate(canvas, gl, compiledShaders, texture, buffers)
      }
    }
  }, [canvasRef, shaders, image, textureData])

  return (
    <div>
      <canvas ref={canvasRef} {...{ style, className }} />
    </div>
  )
}
