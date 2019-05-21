import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  selectedPerformanceSources = new BehaviorSubject([]);

  constructor() { }
}
