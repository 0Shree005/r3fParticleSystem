uniform float uSize;
uniform float uTime;
uniform float uAnimate;

attribute float aScale;
attribute float aRandom;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec3 animatedOffset = vec3(
        sin(uTime + aRandom * 70.0) * aScale,
        sin(uTime + aRandom * 90.0) * aScale,
        cos(uTime + aRandom * 30.0) * aScale
    );

    modelPosition.xyz += animatedOffset * uAnimate;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 /- viewPosition.z);

}
