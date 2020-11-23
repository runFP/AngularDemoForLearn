import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh, Vector3, Geometry, LineBasicMaterial, Line,
} from 'three';

@Component({
  selector: 'app-three-first-demo',
  templateUrl: './three-first-demo.component.html',
  styleUrls: ['./three-first-demo.component.scss']
})
export class ThreeFirstDemoComponent implements OnInit {
  @ViewChild('scene', {static: true}) htmlScene: ElementRef;

  scene = null;
  camera = null;
  renderer = null;
  geometry = null;
  material = null;
  cube = null;


  constructor(
    private renderer2: Renderer2,
  ) {
  }

  ngOnInit() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer();

    this.geometry = new BoxGeometry();
    this.material = new MeshBasicMaterial({color: 0x00ff00});
    this.cube = new Mesh(this.geometry, this.material);

    this.scene.add(this.cube);
    this.camera.position.z = 5;

    this.renderer.setSize(this.htmlScene.nativeElement.offsetHeight, this.htmlScene.nativeElement.offsetWidth);
    this.renderer2.appendChild(this.htmlScene.nativeElement, this.renderer.domElement);

    // this.render();
    this.render2();
  }

  render() {
    requestAnimationFrame(() => this.render());
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  render2() {
    const geometry = new Geometry();
    const material = new LineBasicMaterial( { color: 0x0000ff } );
    geometry.vertices.push(new Vector3(-10, 0, 0));
    geometry.vertices.push(new Vector3(0, 10, 0));
    geometry.vertices.push(new Vector3(10, 0, 0));
    const line = new Line( geometry, material );
    this.scene.add( line );
    this.camera.position.set( 0, 0, 100 );
    this.renderer.render( this.scene, this.camera );
  }

}
