import { Component, input } from '@angular/core';
import { Profile } from '../../../../data/interfaces/profile.interface';
import { AvatarCircleComponent } from '../../../../common-ui/avatar-circle/avatar-circle.component';
import { SvgIcon } from '../../../../common-ui/svg-icon/svg-icon.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat-workspace-header',
  imports: [AvatarCircleComponent, SvgIcon, RouterLink],
  templateUrl: './chat-workspace-header.component.html',
  styleUrl: './chat-workspace-header.component.scss',
})
export class ChatWorkspaceHeaderComponent {
  profile = input<Profile>();
}
