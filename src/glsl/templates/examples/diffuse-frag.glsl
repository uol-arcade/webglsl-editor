precision highp float;

uniform mat4 viewMatrix;
uniform vec3 cameraPosition;

varying vec3 Normal;
varying vec3 Position;

uniform float time;

void main()
{
    //The light direction
    vec3 lightDir = vec3(1, 0, 1);
    vec3 col = vec3(0.2, 0, 1);
    
    //Ambient
    vec3 amb = vec3(0.02);
    
    //n dot l
    float diff = dot(Normal, lightDir);
    
    //Set frag colour
	gl_FragColor = vec4(vec3(diff * col) + amb, 1);
}