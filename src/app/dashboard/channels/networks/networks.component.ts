import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';
import { Subscription } from 'rxjs';

@AutoUnsubscribe
@Component({
  selector: 'sl-networks',
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.scss']
})

export class NetworksComponent {
  subscriptions: Array<Subscription> = [];

  constructor(private route: ActivatedRoute) {
    this.subscriptions.push(this.route.queryParams
      .subscribe(params => {
        this.handleParams(params);
      })
    );
  }

  private handleParams(params) {
    if (Object.keys(params).length) {
      if (params.network) {
        window.location.href = `${params.url}?${this.getQuery(params)}`;
      } else {
        window.opener.setValue(params);
        window.opener.focus();
        self.close();
      }
    }
  }

  private getQuery(params) {
    return params.network === 'twitter' ? `oauth_token=${params.oauth_token}` :
      `client_id=${params.client_id}&scope=${params.scope}&state=${params.state}&redirect_uri=${params.redirect_uri}`;
  }

}
