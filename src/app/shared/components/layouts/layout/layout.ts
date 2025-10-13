import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBar } from '../../side-bar/side-bar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SideBar],
  templateUrl: './layout.html',
  standalone: true,
  styleUrl: './layout.scss',
})
export class Layout {}
