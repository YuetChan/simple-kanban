import { render, screen } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Provider } from 'react-redux';

import TaskPrioritySelect from './task-priority-select';

const mockStore = configureMockStore([thunk]);

describe('TaskPrioritySelect', () => {
    let store: any = mockStore({ 
        UserCache: {
          _loginedUserEmail: "test_user1@example.com",
        },
    });

    let props: { 
        value: string,
        handleOnPriorityChange: Function
    }

    beforeEach(() => {
        props = { 
            value: "low",
            handleOnPriorityChange: jest.fn()
        }
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });


    it('should render correctly', () => {
        render(
            <Provider store={ store }>
                <TaskPrioritySelect { ... props } />
            </Provider>
        );

        const prioritySelect = screen.getByRole("button", { name: /low/i  })

        expect(prioritySelect).toBeInTheDocument();
    });
});