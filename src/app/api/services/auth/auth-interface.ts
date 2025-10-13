import { FormControl } from '@angular/forms';

export interface AuthForm {
  username: FormControl<string | undefined>;
  password: FormControl<string | undefined>;
}

export interface Auth {
  username: string | undefined;
  password: string | undefined;
}

export interface TokenResponse {
  access_token: 'string';
  refresh_token: 'string';
  token_type: 'string';
}
