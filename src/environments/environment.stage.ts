// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  apiEndpoint: 'https://api-stage.socioconnect.io/api-web/v1/',
  linkPreviewEndpoint: 'https://api.linkpreview.net/',
  linkPreviewKey: '5ce3c72e7cb7f1d06c279e4df0d7f5dfefd51ebe9b414',
  trackingScript: 'https://s3-eu-west-1.amazonaws.com/sl-tracking-staging/script.js',
  firebaseConfig: {
    apiKey: 'AIzaSyBkX0kBjGQqQCr_QYjK3wNdmJURtvFou-A',
    authDomain: 'socio-local-staging.firebaseapp.com',
    databaseURL: 'https://socio-local-staging.firebaseio.com',
    projectId: 'socio-local-staging',
    storageBucket: 'socio-local-staging.appspot.com',
    messagingSenderId: '572901955568'
  },
  googleAnalyticsId: 'UA-111886633-1'
};
