import { Directive, ElementRef, Renderer, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appResizer]'
})
export class ResizerDirective implements OnChanges {

  private el: HTMLElement;

  leftElement: HTMLElement;

  over;

  down;

  @Input('appResizer')
  rightElement: any;

  constructor(el: ElementRef,
              private renderer: Renderer) {
    this.el = el.nativeElement;
  }

  ngOnChanges() {
    if (this.leftElement && !this.rightElement) {
      this.leftElement.style.width = 140 + '%';
      this.el.style.cursor = 'default';
    }
    if (this.rightElement) {
      this.over = this.renderer.listen(this.el , 'mouseover', () => this.mouseOver() );
      if (this.down) {
        this.down();
      }
    }
  }

  mouseOver() {
    this.over();
    this.el.style.cursor = 'col-resize';
    this.leftElement = document.getElementById('leftEl');
    this.down = this.renderer.listen(this.el , 'mousedown', () => {
      if (this.rightElement) {
        const move = this.renderer.listenGlobal('document', 'mousemove', (event2) => {
          this.mouseMove(event2);
          });
        const up = this.renderer.listenGlobal('document', 'mouseup', () => {
          up();
          move();
          this.over();
        });
      }
    });
  }

  mouseMove(event: MouseEvent) {
    if (event) {
      this.leftElement.style.width = event.clientX - 200 + 'px';
    }
  }

}
