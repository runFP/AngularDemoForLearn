import {
  AnimationAction, AnimationClip,
  AnimationMixer,
  DoubleSide, Group, LoopOnce,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Path,
  PlaneBufferGeometry,
  Shape,
  ShapeBufferGeometry, Vector3, VectorKeyframeTrack
} from 'three';

export class Material {
  static i = 0;

  cube = null;
  cubeTmp;
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
  smallCut_left = false;
  smallCut_Right = false;
  carMove1 = false;
  carMove2 = false;
  clampModel = false;
  riveting_1 = false;
  riveting_2 = false;
  riveting_3 = false;
  riveting_4 = false;
  riveting_5 = false;
  riveting_over = false;
  moveBelt_down = false;
  moveLift = false;

  rivetingAfterPosition = new Vector3();
  rivetingBeforePosition = new Vector3();


  constructor() {
    this.id = Material.i++;
    const geometry = new PlaneBufferGeometry(8, 15);
    const material = new MeshStandardMaterial({color: '#fff', side: DoubleSide});
    this.cube = new Mesh(geometry, material);
    this.cubeTmp = this.cube.clone();
    this.cube.rotateX(Math.PI / 2).position.set(-10.3, 6, 9);
  }

  createChangeModel() {
    const cube1 = this.cubeTmp.clone();
    cube1.rotateY(Math.PI / 2).position.set(0, 8, 4);
    const cube2 = cube1.clone();
    cube2.position.setX(8);
    const shape = new Shape();
    shape.lineTo(0, 15);
    shape.lineTo(8, 15);
    shape.lineTo(8, 0);
    const ellipsePath = new Path();
    ellipsePath.absellipse(4, 6, 3, 5, 0, Math.PI * 2, true, 0);
    shape.holes.push(ellipsePath);

    const changeGeometry = new ShapeBufferGeometry(shape);
    const shapeMesh = new Mesh(changeGeometry, new MeshStandardMaterial({color: '#fff', side: DoubleSide}));

    const group = new Group();
    const newGroup = new Group();
    group.add(cube1, cube2, shapeMesh);
    group.position.set(-7.5, 4, 4);
    group.rotateX(Math.PI / 2).rotateZ(-Math.PI / 2);

    const vector = new Vector3();
    this.cube.getWorldPosition(vector);
    newGroup.scale.set(0.5, 0.5, 0.5);
    newGroup.add(group).position.copy(vector).add(new Vector3(2.5, 0, 0));
    this.cube = newGroup;
  }

  updateRivetingPosition(i) {
    const rivetingPosition = new Vector3(20, 0, 0);
    this.cube.getWorldPosition(this.rivetingAfterPosition);
    this.rivetingAfterPosition.sub(this.rivetingBeforePosition);
    rivetingPosition.sub(this.rivetingAfterPosition);
    this.cube.position.add(rivetingPosition);
  }

  initAnimationMove(distanceX, time) {
    const times = [];
    const values = [];
    const rate = distanceX / time / 10;

    for (let j = 0; j < time * 10; j++) {
      times.push(j / 10);
      values.push(this.cube.position.add(new Vector3(rate * j, 0, 0)));
    }

    const mixer = new AnimationMixer(this.cube);
    const track = new VectorKeyframeTrack('position', times, values);
    const clip = new AnimationClip('move', time, [track]);
    const action = mixer.clipAction(clip);
    action.clampWhenFinished = true;
    action.loop = LoopOnce;
    return {track, clip, action, mixer};
  }

  playMoveLift() {
    const animation = this.initAnimationMove(20, 2);
    animation.action.play();
  }
}


