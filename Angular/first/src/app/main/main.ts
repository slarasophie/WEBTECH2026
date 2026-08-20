import { Component, inject, OnInit } from '@angular/core';
import { Left } from './left/left';
import { Right } from './right/right';
import { My } from '../shared/my';

@Component({
  selector: 'app-main',
  imports: [Left, Right],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main implements OnInit{
  private myservice = inject(My)
  private members: any;

  ngOnInit(): void {
    this.myservice.getMembers()
    .then(members => {
      this.members = members;
      console.log('all members in main : ', this.members);
    });
  }

  /* mit neuerer async await -Syntax:

  async ngOnInit(): Promise<void> {
    this.members = await this.myservice.getMembers();
    console.log('all members in main : ', this.members);
  }

  */
}