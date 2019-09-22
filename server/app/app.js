import express from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import checkScope from 'express-jwt-authz'

const app = express();

const checkJwt = jwt({
    // Dynamically provide a signing key based on the kid in the header
    // and the signing keys provided by the JWKS endpoint
    secret: jwksRsa.expressJwtSecret({
        cache: true, //cache the signing key
        rateLimit: true,
        jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
        jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // validate the audience and the issuer
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

  // this must match the algorithm selected in the auth0 dashboard advanced settings in OAuth tab
  algorithms: ['RS256']
});

//app.use(checkJwt);

app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});

app.get('/public', (req, res) => {
    res.json({
        message: 'Hello from a public API'
    })
})

app.get('/private', checkJwt, (req, res) => {
    res.json({
        message: 'Hello from a Private API'
    })
})

app.get('/course', checkJwt, checkScope(['read:courses']), (req, res) => {
    /** 
     * in the real world: this method would read the subscriber ID from the access token, and use it to query
     * the database for author's courses
     */
    res.json({
        courses: [
            { id: 1, title: "Building Apps with React and Redux" },
            { id: 2, title: "Creating Reusable React Components" }
          ]
    })
})

app.listen(process.env.REACT_APP_PORT || 3001)
console.log(`API server listening on ${process.env.REACT_APP_PORT}`, `Audience: `,process.env.REACT_APP_AUTH0_AUDIENCE)
