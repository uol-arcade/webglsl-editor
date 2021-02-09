precision highp float;

uniform mat4 viewMatrix;
uniform vec3 cameraPosition;

varying vec3 Normal;
varying vec3 Position;

uniform float time;

void main()
{
	gl_FragColor = vec4(Normal, 1.0);
}