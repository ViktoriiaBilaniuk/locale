import { SharedPostComponent } from './shared-post.component';

describe('SharedPostComponent', () => {
  let component;
  const postMock = {
    status: 'online',
    channels: {network: 'facebook', name: 'name'},
    message: 'message',
    network: 'facebook',
    type: 'picture',
    pictures: [1]
  };

  beforeEach(() => {
    component = new SharedPostComponent();
    component.post = postMock;
  });

  it ('should return status', () => {
    expect(component.status).toEqual('online');
  });

  it ('should return network name', () => {
    expect(component.networkName).toEqual('name');
  });

  it ('should return description', () => {
    expect(component.description).toEqual('message');
  });

  it ('should return background', () => {
    expect(component.image).toEqual(1);
  });

  it ('should return type', () => {
    expect(component.postType).toEqual('picture');
  });
});
