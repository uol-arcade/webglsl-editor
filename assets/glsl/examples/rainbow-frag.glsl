precision highp float;

uniform mat4 viewMatrix;
uniform vec3 cameraPosition;

varying vec3 Normal;
varying vec3 Position;

uniform float time;

void main()
{
    //Scale time, find RGB components
    float ft = time * 0.2;
    float stR = sin(ft * 0.3) * 0.5 + 1.0;
    float stG = sin(ft * 0.6) * 0.5 + 1.0;
    float stB = sin(ft * 0.9) * 0.5 + 1.0;
    
    //The light direction
    vec3 lightDir = vec3(1, 0, 1);
    vec3 col = vec3(stR, stG, stB);
    
    //Ambient
    vec3 amb = vec3(0.02);
    
    //n dot l
    float diff = dot(Normal, lightDir);
    
    //Set frag colour
	gl_FragColor = vec4(vec3(diff * col) + amb, 1);
}