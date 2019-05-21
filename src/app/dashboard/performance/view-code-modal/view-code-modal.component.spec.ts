import { ViewCodeModalComponent } from './view-code-modal.component';
import { environment } from '../../../../environments/environment';

describe('ViewCodeModalComponent', () => {
  let component;

  beforeEach( () => {
    component = new ViewCodeModalComponent();
  });

  it ('should get codeSnippet', () => {
    component.type = 'booking';
    component.venuePublicId = '1';
    const expectedCode = `
    <!-- Start of SocioLocal tracking -->
      <script>
        (function (i,s,o,g,r,a,m)
{i['SocioLocalTrackingObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new
Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)
[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
       }(window,document,'script','${environment.trackingScript}','sl'))
        sl('booking', '1');
      </script>
    <!-- End of SocioLocal tracking -->`;
    expect(component.codeSnippet).toBe(expectedCode);
  });

});
