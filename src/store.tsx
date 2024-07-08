import { createStore } from 'redux';
import { Reducer } from './reducer';
import { Provider } from 'react-redux';
import React from 'react';
import App from './App';

const store = createStore(Reducer);

const ReduxApp: React.FC = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

export default ReduxApp;
