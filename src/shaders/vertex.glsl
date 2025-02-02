uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute float aRandom;

varying vec3 vColor;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // modelPosition.x += sin(uTime + aRandom * 70.0) * aScale;
    // modelPosition.y += sin(uTime + aRandom * 90.0) * aScale;
    // modelPosition.z += cos(uTime + aRandom * 30.0) * aScale;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 /- viewPosition.z);

    vColor = color;

}
