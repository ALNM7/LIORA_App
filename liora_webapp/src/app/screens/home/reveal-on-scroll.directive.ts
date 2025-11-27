import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;

    // Estado inicial: oculto y levemente desplazado hacia abajo
    node.classList.add('reveal-up');

    // Observa cuando entra/sale del viewport
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
              node.classList.add('in-view');
              this.observer?.unobserve(node);
          } else {
            node.classList.remove('in-view');
          }
        });
      },
      {
        threshold: 0.2,      // 20% visible para activar
        // rootMargin: '0px 0px -10% 0px', // (opcional) para disparar un poco antes
      }
    );

    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
