import { Component, OnInit } from '@angular/core';
import { Store } from '../../../core/store/store';
import { Subscription } from 'rxjs';
import { TUTORIALS_DATA } from './tutorial.constants';

@Component({
  selector: 'sl-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})

export class TutorialComponent implements OnInit {
  currentStep: number;
  currentItem: any;
  statusList: any;
  tutorialKey: any;
  tutorialData: any;
  subscriptions: Subscription[] = [];

  constructor(
    private store: Store) {
  }

  ngOnInit() {
    this.subscribeStatusList();
    this.subscribeTutorialKey();
  }

  subscribeStatusList() {
    this.subscriptions.push(
      this.store.select('tutorialsStatusList').subscribe(value => {
        this.statusList = value;

      })
    );
  }

  subscribeTutorialKey() {
    this.subscriptions.push(
      this.store.select('tutorialKey').subscribe(value => {
        this.tutorialKey = value;
        this.currentStep = 0;
        if (this.tutorialKey) {
          this.tutorialData = TUTORIALS_DATA[this.tutorialKey];
          this.currentItem = this.tutorialData[0];
        }
      })
    );
  }

  checkTutorialStatus() {
    if (this.tutorialKey) {
      return this.statusList[this.tutorialKey];
    }
    return true;
  }

  nextStep() {
    this.currentStep = this.currentStep + 1;
    this.currentItem = this.tutorialData[this.currentStep];
  }

  backStep() {
    this.currentStep = this.currentStep - 1;
    this.currentItem = this.tutorialData[this.currentStep];
  }

  finishTutorial() {
    this.saveTutorialStatus();
  }

  saveTutorialStatus() {
    this.statusList[this.tutorialKey] = true;
    this.store.set('tutorialsStatusList', this.statusList);
    localStorage.setItem('tutorialsStatusList',  JSON.stringify(this.statusList));
    setTimeout( () => {
      this.currentStep = 0;
      this.currentItem = this.tutorialData[0];
    }, 400);
  }
}
