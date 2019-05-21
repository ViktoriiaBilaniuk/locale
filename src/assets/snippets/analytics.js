"use strict";

// unique venue ID stored in variable under window: w['sl'].a[0]
// still not clear:
// Secondary event should just be the user landing on the website so in the header of the website
(function (w) {
  var api = 'http://awseb-e-v-awsebloa-1mdgfaf7f6akw-1119851841.eu-west-1.elb.amazonaws.com/api-web/v1/';

  var onLoadXhr = new XMLHttpRequest();
  onLoadXhr.onreadystatechange = function () { }
  onLoadXhr.open('GET', api + 'someEndpoint?q=' + w['sl'].a[0], true);
  onLoadXhr.send();

  var btn = document.getElementById('socio-local-track');
  btn.addEventListener('click', function () {
    var btnClickXhr = new XMLHttpRequest();
    // specs required, endpoint required
    btnClickXhr.onreadystatechange = function () { }
    btnClickXhr.open('GET', api + 'someEndpoint?q=' + w['sl'].a[0], true);
    btnClickXhr.send();
  });
})(window);

// minified script
/*
<script>
  (function(s, o, c) {
    s.sl = s.sl || function() {s.sl.a = arguments};
    var q = o.createElement(c), w = o.getElementsByTagName(c)[0];
    q.async = 1, q.src = './script.js', w.parentNode.insertBefore(q, w)
  })(window, document, 'script');

  sl('venue-id-here');
</script>
*/

// script to inject in external system
/*
  <script>
    (function (wind, doc, tag) {
      wind.sl = wind.sl || function () {
        wind.sl.a = arguments;
      }
      var item = doc.createElement(tag);
      var place = doc.getElementsByTagName(tag)[0];
      item.async = 1;
      item.src = './script.js';
      place.parentNode.insertBefore(item, place);
    })(window, document, 'script');
    sl('venue-id-here');
  </script>
*/