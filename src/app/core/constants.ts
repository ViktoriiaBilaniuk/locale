import { environment } from './../../environments/environment';

export const CONSTANTS = {
  API_ENDPOINT: environment.apiEndpoint,
  LINK_PREVIEW_ENDPOINT: environment.linkPreviewEndpoint,
  LINK_PREVIEW_KEY: environment.linkPreviewKey,
  JWT_PATH: 'sl-jwt',
  ADMIN_PATH: 'sl-admin',
  FIREBASE_PATH: 'sl-fb-token',
  VENUE_ID_PATH: 'sl-venueId',
  FIREBASE_CONFIG: environment.firebaseConfig,
  GA_ID: environment.googleAnalyticsId,
  FIRST_VENUE_ID_PATH: 'firstVenueId',
  TRACKING_SCRIPT: environment.trackingScript,
  TRACKING_CODE: `
    <!-- Start of SocioLocal tracking -->
      <script>
        (function (i,s,o,g,r,a,m)
{i['SocioLocalTrackingObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new
Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)
[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
       }(window,document,'script','TRACKING_SCRIPT','sl'))
        sl('TYPE', 'VENUE_PUBLIC_ID');
      </script>
    <!-- End of SocioLocal tracking -->`
};
