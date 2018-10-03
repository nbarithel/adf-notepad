import { Directive, ElementRef, HostListener, Renderer } from '@angular/core';

@Directive({
  selector: '[appResizer]'
})
export class ResizerDirective {

  private el: HTMLElement;

  leftElement: HTMLElement;

  righElement: HTMLElement;

  constructor(el: ElementRef, private renderer: Renderer) {
    this.el = el.nativeElement;
  }

  @HostListener('mouseover') onmouseover() {
    this.el.style.cursor = 'col-resize';
    this.leftElement = document.getElementById('leftEl');
    this.righElement = document.getElementById('rightEl');
    if (this.righElement) {
      const click = this.renderer.listen(this.el , 'mousedown', (event) => {
        if (event) {
          this.mouseMove(event);
          const move = this.renderer.listenGlobal('document', 'mousemove', (event2) => {
            this.mouseMove(event2);
          });
          const up = this.renderer.listenGlobal('document', 'mouseup', () => {
            move();
            click();
            up();
          });
        }
      });
    }
  }

  mouseMove(event: MouseEvent) {
    this.leftElement.style.width = event.clientX - 200 + 'px';
  }

}
