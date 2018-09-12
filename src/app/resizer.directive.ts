import { Directive, ElementRef, HostListener, Renderer } from '@angular/core';
import { NoteService } from './app-layout/app-layout.component';

@Directive({
  selector: '[appResizer]'
})
export class ResizerDirective {

  private el: HTMLElement;

  oldW = 100;

  leftElement: HTMLElement;

  constructor(el: ElementRef,
              private renderer: Renderer) {
    this.el = el.nativeElement;
  }

  @HostListener('mouseover') onmouseover() {
    this.el.style.cursor = 'col-resize';
    this.leftElement = document.getElementById('leftEl');
    const click = this.renderer.listen(this.el , 'mousedown', (event) => {
      if (event) {
        const move = this.renderer.listenGlobal('document', 'mousemove', (event2) => {
          this.mouseMove(event2);
        });
        this.renderer.listenGlobal('document', 'mouseup', () => {
          move();
          click();
        });
      }
    });
  }

  mouseMove(event: MouseEvent) {
    this.oldW += event.movementX / 10;
    this.leftElement.style.width = this.oldW + '%';
  }

}
