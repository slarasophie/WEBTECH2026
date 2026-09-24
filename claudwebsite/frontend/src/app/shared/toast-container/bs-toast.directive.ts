import { AfterViewInit, Directive, ElementRef, input } from '@angular/core';
import { ToastService } from '../toast.service';

// Bootstrap wird global ueber angular.json (scripts: bootstrap.bundle.min.js) eingebunden,
// daher steht "bootstrap" als globale Variable zur Verfuegung (kein npm-Import noetig).
declare const bootstrap: any;

/**
 * Bindet Bootstraps eigene Toast-Komponente ein, genau wie im Webtech-Skript beschrieben:
 * https://getbootstrap.com/docs/5.3/components/toasts/
 * Beim Erscheinen des Elements wird ein bootstrap.Toast erzeugt und angezeigt (inkl.
 * automatischem Ausblenden nach 4 Sekunden). Sobald Bootstrap den Toast ausblendet
 * (Event "hidden.bs.toast" - egal ob automatisch oder per Klick auf den Schliessen-Button),
 * wird die Meldung aus dem ToastService entfernt.
 *
 * Hinweis: ngAfterViewInit() statt ngOnInit(), da das Toast-Element (this.el.nativeElement)
 * erst nach dem View-Rendering existiert. Das Skript zeigt nur ngOnInit(); AfterViewInit
 * ist hier aber notwendig, da Bootstrap.Toast() ein bereits im DOM vorhandenes Element braucht.
 */
@Directive({
  selector: '[appBsToast]'
})
export class BsToastDirective implements AfterViewInit {
  constructor(
    private el: ElementRef<HTMLElement>,
    private toastService: ToastService
  ) {}

  readonly toastId = input.required<number>({ alias: 'appBsToast' });

  ngAfterViewInit(): void {
    const toastElement = this.el.nativeElement;
    const toast = new bootstrap.Toast(toastElement, { delay: 4000 });

    toastElement.addEventListener('hidden.bs.toast', () => {
      this.toastService.dismiss(this.toastId());
    });

    toast.show();
  }
}
