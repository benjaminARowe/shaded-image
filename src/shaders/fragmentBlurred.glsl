varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform lowp float radius;

void main(void) {
	lowp vec4 tex = texture2D(uSampler, vTextureCoord);
	gl_FragColor =tex.rgba;
}
