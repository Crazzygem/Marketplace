import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navigation/navbar.component';
import { SidebarComponent } from './shared/components/navigation/sidebar.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
}