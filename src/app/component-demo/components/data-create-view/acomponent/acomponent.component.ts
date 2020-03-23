import {Component} from '@angular/core';
import {WillBeCreateComponent} from '../will-be-create/will-be-create.component';

@Component({
  selector: 'app-acomponent',
  templateUrl: './acomponent.component.html',
  styleUrls: ['./acomponent.component.scss']
})
export class AComponentComponent extends WillBeCreateComponent {
}
