import { Component, inject } from '@angular/core';
import { My } from '../shared/my';

@Component({
  selector: 'app-example',
  imports: [],
  templateUrl: './example.html',
  styleUrl: './example.css',
})
export class Example {

  private myservice = inject(My)
}