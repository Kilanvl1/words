import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, GOOGLE_REDIRECT_URL } from '$env/static/private';
import { Google } from 'arctic';

//export const oauth2Client = new OAuth2Client(SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, redirectURL);

export const google = new Google(SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, GOOGLE_REDIRECT_URL);
