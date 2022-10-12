import { gl } from '../../global.js';
import { ShaderProgram } from '../../shaderProgram.js';
const PARTICLE_VERTEX_SHADER = `#version 300 es
    precision mediump float;

    const float GRAVITY = 0.98;

    layout(location=0) in vec2 a_position;
    layout(location=1) in vec2 a_velocity;
    layout(location=2) in vec3 a_color;
    layout(location=3) in float a_radius;
    layout(location=4) in float a_lifeTime;
    layout(location=5) in float a_age;

    uniform float u_timeDelta;

    out vec2 v_position;
    out vec2 v_velocity;
    out vec3 v_color;
    out float v_radius;
    out float v_lifeTime;
    out float v_age;

    highp float rand(vec2 co) {
        highp float a = 12.9898;
        highp float b = 78.233;
        highp float c = 43758.5453;
        highp float dt= dot(co.xy ,vec2(a,b));
        highp float sn= mod(dt,3.14);
        return fract(sin(sn) * c);
    }

    void randomize() {
        float r = rand(vec2(gl_VertexID, u_timeDelta));
        float ra = 6.283 * r;
        float rx = r * cos(ra);
        float ry = r * sin(ra);

        v_position = vec2(0.0, 0.0);
        v_velocity = vec2(rx, ry);
        v_radius = 10.0;
        v_color = vec3(1.0, 0.0, 1.0);
        v_lifeTime = 1.0;
        v_age = 0.0;
    }

    void main(void) {
        if(a_lifeTime == 0.0 || a_age > a_lifeTime) { // TODO: its slow as fuck
            randomize();
        } else {
            v_position = a_position;
            v_velocity = a_velocity;
            v_color = a_color;
            v_radius = a_radius;
            v_lifeTime = a_lifeTime;

            v_velocity.y -= GRAVITY * u_timeDelta;
            v_position += v_velocity * u_timeDelta;
        }

        gl_PointSize = a_radius;
        gl_Position = vec4(v_position, 0.0, 1.0);

        v_age += u_timeDelta;
    }
`;
const PARTICLE_FRAGMENT_SHADER = `#version 300 es
    precision mediump float;

    in vec3 v_color;
    out vec4 f_color;
    
    void main(void) {
        f_color = vec4(v_color, 1.0);
    }
`;
export const particleShaderProgram = new ShaderProgram(PARTICLE_VERTEX_SHADER, PARTICLE_FRAGMENT_SHADER, ['v_position', 'v_velocity', 'v_color', 'v_radius', 'v_lifeTime', 'v_age']);
export const particleShaderTimeDeltaUniformLocation = gl.getUniformLocation(particleShaderProgram.getProgram(), 'u_timeDelta');
