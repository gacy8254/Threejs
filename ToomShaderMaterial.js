import * as THREE from 'three'
import toonVertexShader from './shaders/my/toon.vert?raw'
import toonFragmentShader from './shaders/my/toon.frag?raw'

export class ToonShaderMaterial extends THREE.ShaderMaterial {
  constructor({ colorMap }) {
    super({
      lights: true,
      uniforms: {
        ...THREE.UniformsLib.lights,
        uGlossiness: {
          value: 20,
        },
        uColorMap: {
          value: colorMap,
        },
      },
    })

    this.vertexShader = toonVertexShader
    this.fragmentShader = toonFragmentShader
  }
}
