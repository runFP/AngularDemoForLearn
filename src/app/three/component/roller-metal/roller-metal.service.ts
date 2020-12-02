import {Injectable} from '@angular/core';
import {Camera, Scene} from 'three';

@Injectable({
  providedIn: 'root'
})
export class RollerMetalService {

  constructor() {
  }

  createScene(): Scene {
    return new Scene();
  }

  createCamera(): Camera {
    return new Camera();
  }

  createLight() {
  }

  create


}
