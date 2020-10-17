/**
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or
 *     FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
export function compileShader(gl, shaderSource, shaderType) {
  // Create the shader object
  var shader = gl.createShader(shaderType);

  // Set the shader source code.
  gl.shaderSource(shader, shaderSource);

  // Compile the shader
  gl.compileShader(shader);

  // Check if it compiled
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }

  return shader;
}

/**
 * Creates a program from 2 shaders.
 *
 * @param {!WebGLRenderingContext) gl The WebGL context.
 * @param {!WebGLShader} vertexShader A vertex shader.
 * @param {!WebGLShader} fragmentShader A fragment shader.
 * @return {!WebGLProgram} A program.
 */
export function createProgram(gl, vertexShader, fragmentShader) {
  // create a program.
  var program = gl.createProgram();

  // attach the shaders.
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // link the program.
  gl.linkProgram(program);

  // Check if it linked.
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    // something went wrong with the link
    throw "program failed to link:" + gl.getProgramInfoLog(program);
  }

  return program;
}

export function bindBuffers(gl, currentProgram, buffers) {
  let textureCoordLocation = gl.getAttribLocation(
    currentProgram,
    "aTextureCoord"
  );
  const num = 2; // every coordinate composed of 2 values
  const type = gl.FLOAT; // the data in the buffer is 32 bit float
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set to the next
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
  gl.vertexAttribPointer(
    textureCoordLocation,
    num,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(textureCoordLocation);

  let vertexLocation = gl.getAttribLocation(currentProgram, "aVertexPosition");
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
  gl.vertexAttribPointer(vertexLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexLocation);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  gl.activeTexture(gl.TEXTURE0);
  //gl.bindTexture(gl.TEXTURE_2D, texture);
  let samplerLocation = gl.getUniformLocation(currentProgram, "uSampler");
  gl.uniform1i(samplerLocation, 0);
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
export function loadTexture(gl, url, callback) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  const image = new Image();
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
	  callback();
  };
  image.src = url;

  return { texture: texture, image: image };
}
function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

export function initBuffers(gl) {
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1.0,
      -1.0,
      3.0,

      -1.0,
      1.0,
      2.0,

      1.0,
      1.0,
      1.0,

      1.0,
      -1.0,
      0.0,
    ]),
    gl.STATIC_DRAW
  );

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  const textureCoordinates = [
    // Front
    0.0,
    1.0,

    0.0,
    0.0,

    1.0,
    0.0,

    1.0,
    1.0,
  ];

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    gl.STATIC_DRAW
  );

  let indexBuffer = gl.createBuffer();

  let indices = [0, 1, 2, 0, 2, 3];

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  //return {
  //  position: positionBuffer,
  //  textureCoord: textureCoordBuffer,
  //  indices: indexBuffer,
  //};
  return {
    vertex: vertexBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}
