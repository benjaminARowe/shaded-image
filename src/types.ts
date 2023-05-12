export interface Buffers {
  vertex: WebGLBuffer | null;
  textureCoord: WebGLBuffer | null;
  indices: WebGLBuffer | null;
}

export interface Shader {
  vertexShader: string;
  fragmentShader: string;
  initFunction: Function;
  updateFunction: Function;
  program: WebGLProgram | null;
}

export interface CompiledShader {
  program: WebGLProgram;
  initFunction: Function;
  updateFunction: Function;
}

export interface TextureData {
  width: number;
  height: number;
  data: Iterable<number>;
}

export interface Texture {
  texture: WebGLTexture | null;
  image?: HTMLImageElement;
}
