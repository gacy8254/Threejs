import * as THREE from './node_modules/three/build/three.module.js';
import CustomShaderMaterial from './node_modules/three-custom-shader-material/vanilla'
import particleShader from './shaders/my/particle.frag?raw'
import particleVertShader from './shaders/my/particle.vert?raw'
import particleName from './static/images/otherImages/sphere.png'

let positions, velocities, originalPositions, particles;
const textureLoader = new THREE.TextureLoader();
const pointMap = textureLoader.load(particleName);
const PARTICLE_COUNT = 500;

function addParticle(scene)
{
    //添加粒子
    // 粒子位置、速度数组
    positions = new Float32Array(PARTICLE_COUNT * 3);
    velocities = new Float32Array(PARTICLE_COUNT * 3);
    originalPositions = new Float32Array(PARTICLE_COUNT * 3);
    // 初始化粒子位置和速度
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // 随机位置
      positions[i3] = (Math.random() - 0.5) * 2;     // x
      positions[i3 + 1] = (Math.random() - 0.5) * 2; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 2; // z
      // 保存初始位置（可选，用于飘动回原位置等逻辑）
      originalPositions[i3] = positions[i3];
      originalPositions[i3 + 1] = positions[i3 + 1];
      originalPositions[i3 + 2] = positions[i3 + 2];
      // 随机飘动速度
      velocities[i3] = (Math.random() - 0.5) * 0.002;     // vx
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.06; // vy
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.002; // vz
    }
    // 创建 BufferGeometry 并设置位置属性
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    // 创建自发光粒子材质
    // 使用 PointsMaterial，可以设置颜色和透明度，模拟发光
    const material = new CustomShaderMaterial({
    baseMaterial: THREE.PointsMaterial,
    // vertexShader: particleVertShader,
    fragmentShader : particleShader,
      depthWrite: false, // 关闭深度写入
      color: 0xffff8f,        // 青色
      transparent: true,
      opacity: 0.8,
      alphaMap : pointMap,
      size : 0.01,
      // 如果你想要更真实的自发光，可以启用 blending
      blending: THREE.AdditiveBlending, // 让粒子叠加更亮，类似发光
      vertexColors: false,    // 我们暂时不用顶点颜色
      // uniforms :{
      //   uMaskTex : {value : pointMap}
      // }
    });
    // 创建粒子系统
    particles = new THREE.Points(geometry, material);
    scene.add(particles);  
}

function updateParticle(delta)
{
    const positions = particles.geometry.attributes.position.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3; 
      // 更新位置：根据速度飘动
      positions[i3] += velocities[i3] * delta;     // x
      positions[i3 + 1] += velocities[i3 + 1] * delta; // y
      positions[i3 + 2] += velocities[i3 + 2] * delta; // z 
      // 可选：添加边界或回绕逻辑，让粒子在一定范围内运动
      // 比如简单的 Y 轴飘动 + 回绕
      if (positions[i3 + 1] > 10) positions[i3 + 1] = -5;
      if (positions[i3 + 1] < -10) positions[i3 + 1] = 5;  
      // 也可以对 X 和 Z 做限制或回绕
    }   
    // 标记位置属性需要更新
    particles.geometry.attributes.position.needsUpdate = true;  
    // 可选：让整个粒子系统缓慢旋转
    particles.rotation.y += 0.001;
}

export {addParticle, updateParticle };