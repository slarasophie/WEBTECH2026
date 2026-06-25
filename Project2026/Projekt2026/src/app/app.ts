import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Nav } from './nav/nav';
import { Footer } from './footer/footer';
import { Main } from './main/main';
import { Impresum } from './Impresum/impresum';
import { Login } from './Login/login';
import { Registration } from './registration/registration';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Nav, Footer, Main, Impresum, Login, Registration],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Projekt2026');
}
