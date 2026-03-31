import { refresh } from './app/auth/service.js';

const fakeToken = "paste_a_real_refresh_token_here";

refresh(fakeToken)
  .then(res => console.log('Success:', res))
  .catch(err => console.error('Error:', err.message));