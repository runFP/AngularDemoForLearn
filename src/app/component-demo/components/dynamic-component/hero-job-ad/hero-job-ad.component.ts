import {Component, Input, OnInit} from '@angular/core';
import {AdComponent} from '../ad-component';

@Component({
  selector: 'app-hero-job-ad',
  exportAs: 'HeroJob',
  templateUrl: './hero-job-ad.component.html',
  styleUrls: ['./hero-job-ad.component.scss']
})
export class HeroJobAdComponent implements AdComponent {

  @Input() data: any;

  constructor() {
  }

}
