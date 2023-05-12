import {
  html,
  css,
  LitElement,
  CSSResultOrNative,
  PropertyValueMap,
} from "lit";
import { customElement, property, query } from "lit/decorators.js";

import "./ShadedImage.js";

@customElement("shaded-image-anim-test")
export class AnimTestImage extends LitElement {
  @property()
  image: string | null = null;

  @property()
  class: string = "";

  private fragmentShader = `
        varying highp vec2 vTextureCoord;
        uniform sampler2D uSampler;

        uniform lowp float time;
  
        void main(void) {
            lowp vec4 tex = texture2D(uSampler, vTextureCoord);
            lowp float col = (0.2126 * tex.r + 0.7152 * tex.g + 0.0722*tex.b);
            //col = col * sin(time);
            gl_FragColor = vec4(sin(time), col, col, tex.a);
        }
  
        `;
  private vertexShader = `
        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoord;
  
        varying highp vec2 vTextureCoord;
  
        void main(void) {
            gl_Position =  vec4(aVertexPosition.xy, 0.0, 1.0);
            vTextureCoord = aTextureCoord;
        }
      `;
  private shaders = [
    {
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      initFunction: (args: any) => {},
      updateFunction: (args: any) => {
        const gl = args.context;
        const program = args.program;
        const timeLoc = gl.getUniformLocation(program, "time");

        gl.uniform1f(timeLoc, Number(Math.sin(new Date().getTime() / 1000)));
      },
    },
  ];
  render() {
    console.log(this.style);
    return html`<shaded-image
      style="width:100%;height:100%;"
      .class=${this.class}
      .shaders="${this.shaders}"
      .image=${this.image}
    ></shaded-image>`;
  }
}
