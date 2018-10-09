import { Directive, ElementRef, HostListener, Renderer } from '@angular/core';

@Directive({
  selector: '[appResizer]'
})
export class ResizerDirective {

  private el: HTMLElement;

  leftElement: HTMLElement;

  over;

  constructor(el: ElementRef, private renderer: Renderer) {
    this.el = el.nativeElement;
    this.over = this.renderer.listen(this.el , 'mouseover', () => this.mouseOver() );
  }

  mouseOver() {
    this.over();
    this.el.style.cursor = 'col-resize';
    this.leftElement = document.getElementById('leftEl');
    this.renderer.listen(this.el , 'mousedown', () => {
      if (document.getElementById('rightEl')) {
        const move = this.renderer.listenGlobal('document', 'mousemove', (event2) => {
          this.mouseMove(event2);
          const up = this.renderer.listenGlobal('document', 'mouseup', () => {
            move();
            up();
          });
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
