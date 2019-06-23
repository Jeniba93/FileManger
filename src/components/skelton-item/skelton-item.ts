import { Component, Input } from '@angular/core';

@Component({
  selector: 'skelton-item',
  templateUrl: 'skelton-item.html'
})
export class SkeltonItemComponent {
  styles: any = {};
  
  @Input() width: any;
  @Input() height: any;
  @Input() radius: any;
  @Input() color: any;

  constructor() {
  }
  ngOnInit(){
    this.styles = {
      width: this.width ? this.width : '100%',
      height: this.height ? this.height : '16px'
    }

    if (typeof this.radius !== 'undefined' && this.radius !== '') {
      this.styles.borderRadius = this.radius;
    }
    if (typeof this.color !== 'undefined' && this.color !== '') {
      this.styles.background = 'linear-gradient(to right, $gradientColor1 8%, '+this.color+' 18%, $gradientColor1 33%)';
    }
  }
}
