import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from '$env/static/private';
import { Google } from 'arctic';

const redirectURL = 'http://localhost:5173/oauth';

//export const oauth2Client = new OAuth2Client(SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, redirectURL);

export const google = new Google(SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, redirectURL);
