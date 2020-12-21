import {DoubleSide, Mesh, MeshBasicMaterial, PlaneBufferGeometry} from 'three';

export class Material {
  cube: Mesh = null;

  constructor() {
    const geometry = new PlaneBufferGeometry(8, 15, );
    const material = new MeshBasicMaterial({color: '#fff', side: DoubleSide});
    this.cube = new Mesh(geometry, material);
    this.cube.rotateX(Math.PI / 2).position.set(-9, 5, 9);

  }
}
