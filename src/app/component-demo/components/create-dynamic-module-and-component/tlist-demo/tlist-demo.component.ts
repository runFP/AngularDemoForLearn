import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tlist-demo',
  templateUrl: './tlist-demo.component.html',
  styleUrls: ['./tlist-demo.component.scss']
})
export class TlistDemoComponent implements OnInit {
  items: any[] = [
    { title: 'Item 1' },
    { title: 'Item 2' },
    { title: 'Item 3' },
  ];

  constructor() { }

  ngOnInit() {
  }

}
