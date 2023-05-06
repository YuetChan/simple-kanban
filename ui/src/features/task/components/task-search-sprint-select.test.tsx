import { render, screen } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Provider } from 'react-redux';

import TaskSearchSprintSelect from './task-search-sprint-select';

const mockStore = configureMockStore([thunk]);

describe('TaskSearchPrioritySelect', () => {
    let store: any = mockStore({ 
        UserCache: {
          _loginedUserEmail: "test_user1@example.com",
        },
    });

    let props: { }

    beforeEach(() => {
        props = { }
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });


    it('should render correctly', () => {
        render(
            <Provider store={ store }>
                <TaskSearchSprintSelect { ... props } />
            </Provider>
        );

        const sprintLabel = screen.getByText("Sprint")

        expect(sprintLabel).toBeInTheDocument();
    });
});