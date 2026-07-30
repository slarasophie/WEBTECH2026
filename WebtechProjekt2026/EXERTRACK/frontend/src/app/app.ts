import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Login } from './login/login';
import { Registration } from './registration/registration';
import { Create } from './create/create';
import { Detail } from './detail/detail';
import { Home } from './home/home';
import { Nav } from './nav/nav';
import { Table } from './table/table';
import { Contact } from './contact/contact';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Login, Contact, Registration, Create, Detail, Home, Nav, Table],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
