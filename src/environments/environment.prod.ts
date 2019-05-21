export const environment = {
  production: true,
  // TODO: change to prod endpoint when ready
  apiEndpoint: 'https://api.socioconnect.io/api-web/v1/',
  linkPreviewEndpoint: 'https://api.linkpreview.net/',
  linkPreviewKey: '5ce3c72e7cb7f1d06c279e4df0d7f5dfefd51ebe9b414',
  trackingScript: 'https://s3-eu-west-1.amazonaws.com/sl-tracking-production/script.js',
  firebaseConfig: {
    apiKey: 'AIzaSyA0E9o0lF0zan1gNgU07AtINYhMQWWMVio',
    authDomain: 'socio-local.firebaseapp.com',
    databaseURL: 'https://socio-local.firebaseio.com',
    projectId: 'socio-local',
    storageBucket: 'socio-local.appspot.com',
    messagingSenderId: '85735452108'
  },
  googleAnalyticsId: 'UA-111886633-2'
};
