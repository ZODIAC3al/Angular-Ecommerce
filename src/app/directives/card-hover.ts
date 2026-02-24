// card-hover.directive.ts
import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCardHover]',
  standalone: true,
})
export class CardHoverDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
    // Add default transition to the card for smooth shadow appearance
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'box-shadow 0.3s ease');
  }

  @HostListener('mouseenter') onMouseEnter() {
    // 1. Add shadow on card
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 12px 24px rgba(0,0,0,0.15)');

    // 2. Zoom image
    const img = this.el.nativeElement.querySelector('.card-img-top');
    if (img) {
      this.renderer.setStyle(img, 'transform', 'scale(1.1)');
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    // 1. Remove shadow
    this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');

    // 2. Reset image zoom
    const img = this.el.nativeElement.querySelector('.card-img-top');
    if (img) {
      this.renderer.setStyle(img, 'transform', 'scale(1)');
    }
  }
}
