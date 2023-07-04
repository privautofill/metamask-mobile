import React from 'react';
import { shallow } from 'enzyme';
import TransactionHeader from './';
import configureMockStore from 'redux-mock-store';
import { SEPOLIA } from '../../../constants/network';
import { Provider } from 'react-redux';

const mockStore = configureMockStore();
const initialState = {
  engine: {
    backgroundState: {
      NetworkController: {
        providerConfig: {
          type: SEPOLIA,
          nickname: 'Sepolia',
        },
      },
    },
  },
};
const store = mockStore(initialState);

describe('TransactionHeader', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <TransactionHeader
          currentPageInformation={{ title: 'title', url: 'url' }}
        />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
