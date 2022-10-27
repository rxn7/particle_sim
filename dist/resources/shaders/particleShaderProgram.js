import { ShaderProgram } from '../../shaderProgram.js';
import { SHADER_RAND_FUNC } from './include/rand.js';
import { GLSL_VERSION } from './include/version.js';
export class ParticleShaderProgram extends ShaderProgram {
    constructor() {
        super(PARTICLE_VERTEX_SHADER, PARTICLE_FRAGMENT_SHADER, ['v_position', 'v_velocity', 'v_color', 'v_radius', 'v_lifeTime', 'v_maxLifeTime']);
        this.uniforms = {
            timeDelta: this.getUniformLocation('u_timeDelta'),
            time: this.getUniformLocation('u_time'),
            origin: this.getUniformLocation('u_origin'),
            projectionMatrix: this.getUniformLocation('u_projMatrix'),
            init: this.getUniformLocation('u_init'),
        };
    }
}
const PARTICLE_VERTEX_SHADER = `${GLSL_VERSION}
    precision lowp float;

    ${SHADER_RAND_FUNC}

    const float GRAVITY = -900.0;
    const float VELOCITY = 2000.0;
    const float HALF_VELOCITY = VELOCITY * 0.5;

    layout(location=0) in vec2 a_position;
    layout(location=1) in vec2 a_velocity;
    layout(location=2) in vec3 a_color;
    layout(location=3) in float a_radius;
    layout(location=4) in float a_lifeTime;
    layout(location=5) in float a_maxLifeTime;

    uniform float u_timeDelta;
    uniform int u_init;
    uniform int u_time;
    uniform vec2 u_origin;
    uniform mat4 u_projMatrix;

    out vec2 v_position;
    out vec2 v_velocity;
    out vec3 v_color;
    out float v_radius;
    out float v_lifeTime;
    out float v_maxLifeTime;
    out float v_lifeRatio;

    void main(void) {
        if(a_lifeTime >= a_maxLifeTime || u_init == 1) {
            float r = randf(uint(u_time * gl_VertexID));
            float r2 = randf(uint(gl_VertexID*4));
            float r3 = randf(uint(gl_VertexID*8));

            v_position = u_origin;
            v_velocity = vec2(r * VELOCITY - HALF_VELOCITY, r2 * VELOCITY - HALF_VELOCITY);
            v_radius = 10.0 + r * 5.0;
            v_color = vec3(r, r2, r3);
            v_maxLifeTime = 3.0 + r3 * 1.5;

            if(u_init == 1)
                v_lifeTime = v_maxLifeTime * r;
            else
                v_lifeTime = 0.0;
        } else {
            v_position = a_position;
            v_velocity = a_velocity;
            v_color = a_color;
            v_radius = a_radius;
            v_lifeTime = a_lifeTime;
            v_maxLifeTime = a_maxLifeTime;
        }

        v_velocity.y -= GRAVITY * u_timeDelta;
        v_position += v_velocity * u_timeDelta;
        v_lifeTime += u_timeDelta;
        v_lifeRatio = clamp(v_lifeTime / v_maxLifeTime, 0.0, 1.0);

        gl_PointSize = v_radius;
        gl_Position = u_projMatrix * vec4(v_position, 0.0, 1.0);
    }
`;
const PARTICLE_FRAGMENT_SHADER = `${GLSL_VERSION}
    precision lowp float;

    in vec3 v_color;
    in float v_lifeRatio;

    out vec4 f_color;
    
    void main(void) {
        vec2 delta = gl_PointCoord - vec2(0.5, 0.5);
        float lenSqrt = abs(dot(delta, delta));

        if(lenSqrt >= 0.25) {
            f_color = vec4(0, 0, 0, 0);
        } else {
            f_color = vec4(v_color, 1.0 - v_lifeRatio);
        }
    }
`;
