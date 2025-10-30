import { FormControl } from '@angular/forms';

export interface AuthForm {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}

export interface Auth {
  username: string | null;
  password: string | null;
}

export interface TokenResponse {
  access_token: 'string';
  refresh_token: 'string';
  token_type: 'string';
}
