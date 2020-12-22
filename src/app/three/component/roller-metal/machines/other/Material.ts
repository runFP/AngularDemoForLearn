import {DoubleSide, Mesh, MeshBasicMaterial, PlaneBufferGeometry} from 'three';

export class Material {
  static i = 0;

  cube: Mesh = null;
  id;

  // 当前执行的工序状态
  append_v = false;
  append_h = false;
  mc1_left = false;
  mc1_middle = false;
  mc1_right = false;
  big_punch = false;
  mc2_left = false;
  mc2_middle = false;
  mc2_right = false;
  no2_punch = false;
  mc3_left = false;
  mc3_middle = false;
  mc3_right = false;
  no3_punch = false;
  mc4_left = false;
  mc4_middle = false;
  mc4_right = false;
  no4_punch = false;


  constructor() {
    this.id = Material.i++;
    const geometry = new PlaneBufferGeometry(8, 15);
    const material = new MeshBasicMaterial({color: '#fff', side: DoubleSide});
    this.cube = new Mesh(geometry, material);
    this.cube.rotateX(Math.PI / 2).position.set(-10.3, 6, 9);
  }
}


