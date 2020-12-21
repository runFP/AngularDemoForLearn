import {BoxBufferGeometry, Mesh, MeshBasicMaterial} from 'three';

export class Material {
  cube: Mesh = null;

  constructor() {
    const geometry = new BoxBufferGeometry(1, 15, 15);
    const material = new MeshBasicMaterial({color: '#fff'});
    this.cube = new Mesh(geometry, material);
  }
}
