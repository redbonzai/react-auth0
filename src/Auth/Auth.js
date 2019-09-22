import auth0 from 'auth0-js'

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
        this.auth0.authorize();
    }

    handleAuthentication = () => {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);                
            } else if (err) {                
                console.log(`Authentication Error: ${err.error} `, err)
            }

            this.history.push('/');
        })
    }

    setSession = authResult => {
        // set the time that the access token will expire
        const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())

        // If there is a value on the `scope` param of the authResult, 
        // then use it to set scopes in the session for the user.  Otherwise, 
        // use the scopes as requested.  If no scopes were requested, then set it to empty string.
        const scopes = authResult.scope || this.requestedScopes || ''

        localStorage.setItem('access_token', authResult.accessToken)
        localStorage.setItem('id_token', authResult.idToken)
        localStorage.setItem('expires_at', expiresAt)

        /** 
         * we are storing expires_at & scopes for convenience.  
         * That way we don't have to parse the JWT 
         * on the client to use this data for UI-related logic
         */
        localStorage.setItem('scopes', JSON.stringify(scopes))
    }

    isUserAuthenticated() {
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

    logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('id_token')
        localStorage.removeItem('expires_at')
        localStorage.removeItem('scopes')
        this.userProfile = null

        this.auth0.logout({
            clientID: process.env.REACT_APP_AUTH0_CLIENTID,
            returnTo: 'http://localhost:3000'
        });
    }

    getAccessToken = () => {
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
            throw new Error('no access token found')
        }

        return accessToken;
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
        const grantedScopes = (
            JSON.parse(localStorage.getItem('scopes')) || ''
        ).split(' ');
        return scopes.every(scope => grantedScopes.includes(scope))
    }
    
}