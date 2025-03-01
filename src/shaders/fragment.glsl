#define PI 3.1415926535897932384626433832795
uniform float uTime;
uniform float uColorMode;

uniform vec3 uColor;

vec2 rotate(vec2 uv, float rotation, vec2 mid);

void main() {
    // Rotated Star!O_O effect using gl_PointCoord
    vec2 rotatedUv = rotate(gl_PointCoord, PI * 0.25, vec2(0.5));
    float strength = 0.15 / distance(vec2(rotatedUv.x, (rotatedUv.y - 0.5) * 5.0 + 0.5), vec2(0.5));
    strength *= 0.15 / distance(vec2(rotatedUv.y, (rotatedUv.x - 0.5) * 5.0 + 0.5), vec2(0.5));

    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(gl_PointCoord, 1.0);
    uvColor = pow(uvColor, vec3(0.8));
    vec3 mixedColor = mix(blackColor, uvColor, 1.0);

    vec3 finalColor = mix(mixedColor, uColor, uColorMode);

    gl_FragColor = vec4(finalColor, strength);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}
