import {Component, OnInit} from '@angular/core';
import {FlexibleModalComponent} from '../modal-plus/flexible-modal/flexible-modal.component';
import {ModalPlusService} from '../modal-plus/modal-plus.service';


@Component({
  selector: 'app-modal-plus-demo',
  templateUrl: './modal-plus-demo.component.html',
  styleUrls: ['./modal-plus-demo.component.scss']
})
export class ModalPlusDemoComponent implements OnInit {
  overlayRef;
  injector;

  constructor(
    private modalPlusService: ModalPlusService,
  ) {
  }

  ngOnInit() {
  }

  showModal($event) {
    this.modalPlusService.open(FlexibleModalComponent, null, $event.target);
  }

  showModal2($event) {
    this.modalPlusService.open(FlexibleModalComponent, null, $event.target);
  }

  closeModal() {
    // this.overlayRef.detach();
  }
}

