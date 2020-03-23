import {Component} from '@angular/core';
import {WillBeCreateComponent} from '../will-be-create/will-be-create.component';

@Component({
  selector: 'app-bcomponent',
  templateUrl: './bcomponent.component.html',
  styleUrls: ['./bcomponent.component.scss']
})
export class BComponentComponent extends WillBeCreateComponent {
}
