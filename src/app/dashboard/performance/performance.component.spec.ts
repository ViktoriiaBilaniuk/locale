import { PerformanceComponent } from './performance.component';
import {
  PERFORMANCE_SERVICE_STUB,
  PERMISSION_SERVICE_STUB, ROUTE, ROUTER, STORE_STUB, SUBSCRIPTION_STUB, TRACK_STUB,
  VENUE_SERVICE_STUB
} from '../../test/stubs/service-stubs';
import { PERFORMANCE_POSTS, SELECTED_CHANNEL } from '../../test/mocks/performance-mocks';
import { of } from 'rxjs/index';

describe('PerformanceComponent', () => {

  let component: PerformanceComponent;
  const venueService = VENUE_SERVICE_STUB;
  const routeStub = ROUTE;
  const routerStub = ROUTER;
  const trackStub = TRACK_STUB;
  const store = STORE_STUB;
  const permissionsService = PERMISSION_SERVICE_STUB;
  const performanceService = PERFORMANCE_SERVICE_STUB;
  const venueId = '1';
  let storeSelectSpy;
  const selectedChannel = SELECTED_CHANNEL;
  const subscription = SUBSCRIPTION_STUB;

  beforeEach( () => {
    component = new PerformanceComponent(venueService, routeStub, routerStub, trackStub, store, permissionsService, performanceService);
    component.subscriptions = [];
    storeSelectSpy = spyOn(store, 'select').and.returnValue(of(venueId));
    component.venueServiceSubscription = subscription;
  });

  it ('should select venueId', () => {
    component.ngOnInit();
    expect(storeSelectSpy).toHaveBeenCalledWith('venueId');
  });

  it ('should set venueId', () => {
    component.ngOnInit();
    expect(component.venueId).toEqual(venueId);
  });

  it ('should set code snippet type', () => {
    const type = 'booking';
    component.showViewCodeModal(type);
    expect(component.type).toBe(type);
  });

  it ('should set isViewCodeModal to true', () => {
    component.isViewCodeModal = false;
    const type = 'booking';
    component.showViewCodeModal(type);
    expect(component.isViewCodeModal).toBeTruthy();
  });

  it ('should set isViewCodeModal to false', () => {
    component.isViewCodeModal = true;
    component.closeViewCodeModal();
    expect(component.isViewCodeModal).toBeFalsy();
  });

  it ('should return spiner status', () => {
    component.metricsLoaded = component.analiticsLoaded = false;
    expect(component.showSpinner).toBeTruthy();
  });

  it ('should set metricsLoaded and analiticsLoaded to false', () => {
    component.metricsLoaded =  component.analiticsLoaded = true;
    component.showLoading();
    expect(component.metricsLoaded).toBeFalsy();
    expect(component.analiticsLoaded).toBeFalsy();
  });

  it ('should postsLoading & postsIsOpen to true in onViewPostClick', () => {
    component.onViewPostClick(selectedChannel);
    expect(component.postsLoading).toBeFalsy();
    expect(component.postsIsOpen).toBeTruthy();
    expect(component.selectedChannel).toEqual(selectedChannel);
  });

  it ('posts should be inited', () => {
    component.onViewPostClick(selectedChannel);
    expect(component.posts).toBeDefined();
  });

  it ('should close performance modal', () => {
    component.closePerformanceModal();
    expect(component.postsIsOpen).toBeFalsy();
  });

  it ('should set currentPostFilter', () => {
    component.closePerformanceModal();
    expect(component.currentPostFilter).toEqual('date');
  });

  describe('filters', () => {

    beforeEach(() => {
      component.selectedChannel = selectedChannel;
      component.posts = undefined;
      component.postSubscription = { unsubscribe: function() {} as any };
      spyOn(venueService, 'fetchPerformancePosts').and.returnValue(of(PERFORMANCE_POSTS));
    });

    it ('should assign currentPostFilter', () => {
      component.onApplyFilter('performance');
      expect(component.currentPostFilter).toEqual('performance');
    });

    it ('should call sortByDate', () => {
      component.onApplyFilter('performance');
      expect(component.currentPostFilter).toEqual('performance');
    });

    it ('should define groupedPosts with performance filter', () => {
      component.onApplyFilter('performance');
      expect(component.groupedPosts).toBeDefined();
    });

    it ('should define groupedPosts with likes filter', () => {
      component.onApplyFilter('likes');
      expect(component.groupedPosts).toBeDefined();
    });

    it ('should define groupedPosts with reach filter', () => {
      component.onApplyFilter('reach');
      expect(component.groupedPosts).toBeDefined();
    });

  });

  describe('metrics', () => {
    const metricsMock = [['1', '1', '1'], ['2', '2', '2'], ['3', '3', '3']];
    beforeEach(() => {
      component.booking = metricsMock;
      component.landing = metricsMock;
    });

    it ('should return true in hasBookings', () => {
      expect(component.hasBookings).toBeTruthy();
    });

    it ('should return true in hasLanding', () => {
      expect(component.hasLandings).toBeTruthy();
    });
  });

});
