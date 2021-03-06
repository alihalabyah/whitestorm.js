import {
  Mesh,
  BoxBufferGeometry,
  BoxGeometry
} from 'three';
import {BoxMesh, SoftMesh} from '../../physics/index.js';

import {Component} from '../../core/Component';
import {MeshComponent} from '../../core/MeshComponent';
import {PhysicsComponent} from '../../core/PhysicsComponent';
import {SoftbodyComponent} from '../../core/SoftbodyComponent';
import {loadMaterial} from '../../utils/index';

@SoftbodyComponent
@PhysicsComponent
@MeshComponent
class Box extends Component {
  static defaults = {
    ...Component.defaults,
    geometry: {
      width: 1,
      height: 1,
      depth: 1
    }
  };

  static instructions = {
    ...Component.instructions,
    geometry: ['width', 'height', 'depth']
  };

  constructor(params = {}) {
    super(params, Box.defaults, Box.instructions);

    if (params.build) {
      this.build(params);
      super.wrap();
    }
  }

  build(params = {}) {
    const material = loadMaterial(params.material);

    let MeshNative;

    if (this.physics && this.params.softbody) MeshNative = SoftMesh;
    else if (this.physics) MeshNative = BoxMesh;
    else MeshNative = Mesh;

    return new Promise((resolve) => {
      this.native = new MeshNative(
        this.buildGeometry(params),
        material,
        this.params
      );

      resolve();
    });
  }

  buildGeometry(params = {}) {
    const GConstruct = params.buffer && !params.softbody ? BoxBufferGeometry : BoxGeometry;

    const geometry = new GConstruct(
      params.geometry.width,
      params.geometry.height,
      params.geometry.depth
    );

    if (params.softbody) this.proccessSoftbodyGeometry(geometry);

    return geometry;
  }

  set g_width(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {width: val}}));
  }

  get g_width() {
    return this._native.geometry.parameters.width;
  }

  set g_height(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {height: val}}));
  }

  get g_height() {
    return this._native.geometry.parameters.height;
  }

  set g_depth(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {depth: val}}));
  }

  get g_depth() {
    return this._native.geometry.parameters.depth;
  }

  // clone() {
  //   return this.params.softbody ? new Box(this.params) : new Box({build: false}).copy(this);
  // }
}

export {
  Box
};
