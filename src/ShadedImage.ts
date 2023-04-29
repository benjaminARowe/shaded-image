import {
  html,
  css,
  LitElement,
  CSSResultOrNative,
  PropertyValueMap,
} from "lit";
import { property, query, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

import {
  compileShader,
  createProgram,
  initBuffers,
  bindBuffers,
  loadTexture,
  textureFromData,
} from "./shaderUtils.js";
interface Shader {
  vertexShader: string;
  fragmentShader: string;
  initFunction: Function;
  updateFunction: Function;
  program: WebGLProgram | null;
}

interface TextureData {
  width: number;
  height: number;
  data: Iterable<number>;
}

export class ShadedImage extends LitElement {
  @property()
  shaders: Array<Shader> = [];

  @property()
  image: string | null = null;

  @property()
  textureData: TextureData | null = null;

  @property()
  values: any = null;

  @property()
  class: string = "";

  @state()
  texture: any = null;

  private _canvas: HTMLCanvasElement | null = null;
  set canvas(canvas: HTMLCanvasElement | null) {
    this._canvas = canvas;
  }

  @property()
  get canvas() {
    return this._canvas;
  }

  private _gl: WebGLRenderingContext | null = null;
  set gl(context: WebGLRenderingContext | null) {
    this._gl = context;
  }

  @property()
  get gl() {
    //return ;
    return this._gl;
  }

  createShaders() {
    const gl = this.gl;
    const shaders = this.shaders;

    if (gl == null) throw "No GLContext available";
    if (shaders == null) throw "No Shader available";
    console.log(shaders[0]);

    let compiledShaders = shaders.map((shader: Shader) => {
      console.log(shader.vertexShader);
      let vertexShader = compileShader(
        gl,
        shader.vertexShader,
        gl.VERTEX_SHADER
      );
      let fragmentShader = compileShader(
        gl,
        shader.fragmentShader,
        gl.FRAGMENT_SHADER
      );

      let shaderProgram = createProgram(gl, vertexShader, fragmentShader);

      return {
        program: shaderProgram,
        initFunction: shader.initFunction,
        updateFunction: shader.updateFunction,
      };
    });
    return compiledShaders;
  }

  canvasSetup() {
    const c = this.renderRoot?.querySelector("canvas") ?? null;
    this.canvas = c;
    this.gl = this.canvas?.getContext("webgl") ?? null;
  }

  glBuffers(texture: any) {
    if (this.gl == null) return;
    const gl = this.gl;
    const fb = gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    // attach the texture as the first color attachment
    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      attachmentPoint,
      gl.TEXTURE_2D,
      texture?.texture,
      0
    );

    let buffers = initBuffers(gl);
    return buffers;
  }

  init() {
    /**
     * Provides requestAnimationFrame in a cross browser way.
     * paulirish.com/2011/requestanimationframe-for-smart-animating/
     */

    this.canvasSetup();
    const { compiledShaders, buffers } = this.bind();
    this.glAnimate(compiledShaders, buffers);
  }

  bind(): { compiledShaders: any; buffers: any } {
    if (this.gl == null) throw "No gl context";
    const gl = this.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.enable(gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let compiledShaders = this.createShaders();

    for (let shader of compiledShaders) {
      gl.useProgram(shader.program);
      shader.initFunction({
        program: shader.program,
        context: gl,
        canvas: this.canvas,
        values: this.values,
      });
    }

    if (this.image != null) {
      console.log("Using Image");
      loadTexture(gl, this.image, (t: any) => {
        this.texture = t;
        if (this.texture != null) {
        }
      });
    } else if (this.textureData != null) {
      this.texture = textureFromData(
        gl,
        this.textureData.width,
        this.textureData.height,
        this.textureData.data
      );
      console.log(this.textureData);
      console.log(this.texture);
      if (this.texture != null) {
        console.log("Using Data Image");
      }
    }
    let buffers = this.glBuffers(this.texture);

    return { compiledShaders, buffers };
  }

  glAnimate(compiledShaders: any, buffers: any) {
    if (this.gl == null) return;
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.resizeCanvas();
    this.glRender(compiledShaders, this.texture, buffers);

    window.requestAnimationFrame(() => {
      this.glAnimate(compiledShaders, buffers);
    });
  }

  resizeCanvas() {
    const canvas = this.canvas;
    const gl = this.gl;

    if (canvas == null) throw "No canvas";
    if (gl == null) throw "No context";

    if (
      canvas.width !== canvas.clientWidth ||
      canvas.height !== canvas.clientHeight
    ) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  glRender(shaders: any, texture: any, buffers: any) {
    const gl = this.gl;
    const canvas = this.gl;
    // const shaders = this.shaders;
    if (gl == null) return;

    gl.bindTexture(gl.TEXTURE_2D, texture?.texture);

    for (let [i, currentProgram] of shaders.entries()) {
      if (!currentProgram) return;

      // // Load program into GPU
      gl.useProgram(currentProgram.program);
      currentProgram.updateFunction({
        program: currentProgram.program,
        context: gl,
        canvas: canvas,
        values: this.values,
      });

      // Bind buffers to the current program
      if (!currentProgram.program) throw "Program not created";
      bindBuffers(gl, currentProgram.program, buffers);

      if (i == shaders.length - 1) {
        // render to the canvas
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }

      // Draw the data from our buffers
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }
  }

  render() {
    console.log(this.style);
    return html` <div>
      <canvas class=${this.class} style=${this.style.cssText} />
    </div>`;
  }

  firstUpdated(changedProperties: PropertyValueMap<any>) {
    this.init();
  }
}
