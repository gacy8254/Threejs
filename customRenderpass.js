import {
  EffectComposer, 
  RenderPass,
  SMAAEffect,
  EffectPass,
	SMAAPreset,
    
} from "postprocessing";

import {
BasicDepthPacking
} from 'three'

export class CustomRenderPass extends RenderPass {
    constructor(...args) {
    super(...args); // 将子类接收的所有参数传递给父类

    this.depthTexture = null;
    }

      getDepthTexture() {
        return this.depthTexture;
      }
      /**
       * Sets the depth texture.
       *
       * This method will be called automatically by the {@link EffectComposer}.
       * You may override this method if your pass relies on the depth information of a preceding {@link RenderPass}.
       *
       * @param {Texture} depthTexture - A depth texture.
       * @param {DepthPackingStrategy} [depthPacking=BasicDepthPacking] - The depth packing.
       */
      setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {
        this.depthTexture = depthTexture;
      }
}