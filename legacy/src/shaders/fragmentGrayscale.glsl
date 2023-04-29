varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
	lowp vec4 tex = texture2D(uSampler, vTextureCoord);
	lowp float col = (0.2126 * tex.r + 0.7152 * tex.g + 0.0722*tex.b);
	gl_FragColor = vec4(col, col, col, tex.a);
}
