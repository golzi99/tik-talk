import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBar } from '../../../../../../apps/tik-talk/src/app/common-ui/side-bar/side-bar.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SideBar],
  templateUrl: './layout.component.html',
  standalone: true,
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
