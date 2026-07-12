import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Login } from './login/login';
import { Registration } from './registration/registration';
import { Home } from './home/home';
import { Nav } from './nav/nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Login, Registration, Home, Nav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
