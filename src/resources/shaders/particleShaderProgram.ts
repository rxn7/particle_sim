import { ShaderProgram } from '../../shaderProgram.js'

export class ParticleShaderProgram extends ShaderProgram {
	constructor() {
		super(PARTICLE_VERTEX_SHADER, PARTICLE_FRAGMENT_SHADER, ['v_position', 'v_velocity', 'v_color', 'v_radius'])

		this.uniforms = {
			timeDelta: this.getUniformLocation('u_timeDelta'),
			time: this.getUniformLocation('u_time'),
			origin: this.getUniformLocation('u_origin'),
			randomize: this.getUniformLocation('u_randomize'),
			projectionMatrix: this.getUniformLocation('u_projMatrix'),
		}
	}
}

const PARTICLE_VERTEX_SHADER: string = /*glsl*/ `#version 300 es
    precision mediump float;

    const float GRAVITY = -980.0;

    layout(location=0) in vec2 a_position;
    layout(location=1) in vec2 a_velocity;
    layout(location=2) in vec3 a_color;
    layout(location=3) in float a_radius;

    uniform float u_timeDelta;
    uniform float u_time;
    uniform vec2 u_origin;
    uniform bool u_randomize;
    uniform mat4 u_projMatrix;

    out vec2 v_position;
    out vec2 v_velocity;
    out vec3 v_color;
    out float v_radius;

    uint rand(uint seed) {
        seed = (seed ^ 61u) ^ (seed >> 16u);
        seed *= 9u;
        seed = seed ^ (seed >> 4u);
        seed *= 0x27d4eb2du;
        seed = seed ^ (seed >> 15u);
        return seed;
    }

    void main(void) {
        if(u_randomize) {
            float r = float(rand(uint(u_time * float(gl_VertexID)))) * (1.0 / 4294967296.0);
            float r2 = float(rand(uint(gl_VertexID*4))) * (1.0 / 4294967296.0);
            float r3 = float(rand(uint(gl_VertexID*8))) * (1.0 / 4294967296.0);

            v_position = u_origin;
            v_velocity = vec2(r * 5000.0 - 2500.0, r2 * 5000.0 - 2500.0);
            v_radius = 10.0 + r * 5.0;
            v_color = vec3(r, r2, r3);
        } else {
            v_position = a_position;
            v_velocity = a_velocity;
            v_color = a_color;
            v_radius = a_radius;
            v_velocity.y -= GRAVITY * u_timeDelta;
            v_position += v_velocity * u_timeDelta;
        }

        gl_PointSize = v_radius;
        gl_Position = u_projMatrix * vec4(v_position, 0.0, 1.0);
    }
`

const PARTICLE_FRAGMENT_SHADER: string = /*glsl*/ `#version 300 es
    precision mediump float;

    in vec3 v_color;
    out vec4 f_color;
    
    void main(void) {
        f_color = vec4(v_color, 1.0);
    }
`
