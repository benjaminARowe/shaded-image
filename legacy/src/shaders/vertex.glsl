attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

varying highp vec2 vTextureCoord;

void main(void) {
	gl_Position =  vec4(aVertexPosition.xy, 0.0, 1.0);
	vTextureCoord = aTextureCoord;
}
