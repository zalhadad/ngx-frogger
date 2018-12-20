import {Component} from '@angular/core';

@Component({
  selector: 'ld-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  result;

  constructor() {
    this.result = {};
  }

  display(data) {
    this.result = data;
  }

}
