import { render, screen } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';

import thunk from 'redux-thunk';

import { Provider } from 'react-redux';

import TaskAssigneeSelect from './task-assignee-select';

import { truncate } from '../../../libs/text-lib';

const mockStore = configureMockStore([thunk]);

describe('TaskAssigneeSelect', () => {
    let store: any = mockStore({ });

    let props: {
        assignee: string,
        allAssignees: Array<string>,

        handleOnSelectChange: Function
    }

    beforeEach(() => {
        store = mockStore({
            UserCache: {
                _loginedUserEmail: "test_user1@example.com",
            },
        });

        props = {
            allAssignees: [ 
                "test_user1@example.com", 
                "test_user2@example.com", 
                "test_user3@example.com" 
            ],
            assignee: "test_user1@example.com",

            handleOnSelectChange: jest.fn()
        }
    });

    // For unknow reason, the rendered html would not include rest of the assignees in text format
    it('should render correctly', () => {
        render(
            <Provider store={ store }>
                <TaskAssigneeSelect { ... props } />
            </Provider>
        );

        const assigneeSelect = screen.getByRole("button", { name: truncate("test_user1@example.com", 18) })

        expect(assigneeSelect).toBeInTheDocument();
    });
});
