import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
} from 'three';

@Component({
  selector: 'app-three-first-demo',
  templateUrl: './three-first-demo.component.html',
  styleUrls: ['./three-first-demo.component.scss']
})
export class ThreeFirstDemoComponent implements OnInit, AfterViewInit {
  @ViewChild('scene', {static: true}) htmlScene: ElementRef;

  scene = null;
  camera = null;
  renderer = null;


  constructor(
    private renderer2: Renderer2,
  ) {
  }

  ngOnInit() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer();

  }

  ngAfterViewInit(): void {
    this.renderer.setSize(this.htmlScene.nativeElement.innerWidth, this.htmlScene.nativeElement.innerHeight);
    this.renderer2.appendChild(this.htmlScene.nativeElement, this.renderer.domElement);
  }

}
