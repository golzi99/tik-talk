import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarCircleComponent, SvgIcon } from '@tt/common-ui';
import { Profile } from '@tt/profile';

@Component({
  selector: 'app-chat-workspace-header',
  imports: [AvatarCircleComponent, SvgIcon, RouterLink],
  templateUrl: './chat-workspace-header.component.html',
  styleUrl: './chat-workspace-header.component.scss',
})
export class ChatWorkspaceHeaderComponent {
  profile = input<Profile>();
}
