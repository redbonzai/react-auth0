import auth0 from 'auth0-js'

const REDIRECT_ON_LOGIN = 'redirect_on_login';

// Stored outside class sine these variables are private.
// eslint-disable-next-line
let _idToken = null,
    _accessToken = null, 
    _scopes = null, 
    _expiresAt = null
export default class Auth {
    
    constructor(history) {
        this.history = history;
        this.userProfile = null;
        this.requestedScopes = 'openid profile email read:courses'

        this.auth0 = new auth0.WebAuth({
            domain: process.env.REACT_APP_AUTH0_DOMAIN,
            clientID: process.env.REACT_APP_AUTH0_CLIENTID,
            redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            responseType: 'token id_token',
            scope: this.requestedScopes

        })
    }

    login = () => {
        localStorage.setItem(
            REDIRECT_ON_LOGIN, 
            JSON.stringify(this.history.location)
        )
        this.auth0.authorize();
    }

    handleAuthentication = () => {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {                
                this.setSession(authResult);
                const redirectLocation = localStorage.getItem (REDIRECT_ON_LOGIN) === null
                    ? '/'
                    : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN ))

                this.history.push(redirectLocation)              
            } else if (err) {                
                console.log(`Authentication Error: ${err.error} `, err)
                this.history.push('/');
            }
            
            localStorage.removeItem(REDIRECT_ON_LOGIN)
        })
    }

    setSession = authResult => {
        // set the time that the access token will expire
        _expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

        // If there is a value on the `scope` param of the authResult, 
        // then use it to set scopes in the session for the user.  Otherwise, 
        // use the scopes as requested.  If no scopes were requested, then set it to empty string.
        _scopes = authResult.scope || this.requestedScopes || ''

        _accessToken = authResult.accessToken
        _idToken = authResult.idToken
    }

    isUserAuthenticated() {
        return new Date().getTime() < _expiresAt;
    }

    logout = () => {
        this.auth0.logout({
            clientID: process.env.REACT_APP_AUTH0_CLIENTID,
            returnTo: 'http://localhost:3000'
        });
    }

    getAccessToken = () => {
        
        if (!_accessToken) {
            throw new Error('no access token found')
        }

        return _accessToken;
    }

    getProfile = callback => {
        if (this.userProfile) {
            return callback(this.userProfile)
        }

        this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
            if (profile) {
                this.userProfile = profile;
            }

            callback(profile, err)
        })
    }

    userHasScopes = (scopes) => {
        const grantedScopes = (_scopes || '').split(' ');
        return scopes.every(scope => grantedScopes.includes(scope))
    }
    
}