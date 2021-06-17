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
  modalAId: string;
  modalBId: string;

  constructor(
    private modalPlusService: ModalPlusService,
  ) {
  }

  ngOnInit() {
  }

  showModal($event) {
    this.modalAId = this.modalPlusService.open(FlexibleModalComponent, {name: 1});
  }

  showModal2($event) {
    this.modalBId = this.modalPlusService.open(FlexibleModalComponent, {name: 2});
  }

  toggleModel() {
    this.modalPlusService.setScaleMode(this.modalAId);
  }

  closeModal() {
    // this.overlayRef.detach();
  }
}

