import { Component } from '@angular/core';
import { ToastService } from '../toast.service';
import { BsToastDirective } from './bs-toast.directive';

@Component({
  selector: 'app-toast-container',
  imports: [BsToastDirective],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css'
})
export class ToastContainer {
  constructor(protected toastService: ToastService) {}
}
