import { render, screen, fireEvent } from '@testing-library/react';

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
        props = {
            allAssignees: [ "test_user1@example.com", "test_user2@example.com", "test_user3@example.com" ],
            assignee: "test_user1@example.com",
            handleOnSelectChange: jest.fn()
        }
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });


    it('should render correctly', () => {
        render(
            <Provider store={ store }>
                <TaskAssigneeSelect { ... props } />
            </Provider>
        );

        const assigneeSelect = screen.getByRole("button", { name: truncate("test_user1@example.com", 18)  })
        
        expect(assigneeSelect).toBeInTheDocument();
    });

//   it('should display all the assignees', () => {
//     const assigneeItems = screen.getAllByRole('option');
//     expect(assigneeItems.length).toEqual(allAssignees.length + 1); // +1 for the "none" option

//     allAssignees.forEach((assignee) => {
//       const assigneeItem = screen.getByText(assignee);
//       expect(assigneeItem).toBeInTheDocument();
//     });
//   });

//   it('should call the handleOnSelectChange function when an assignee is selected', () => {
//     const assigneeSelect = screen.getByRole('combobox');
//     const newAssignee = "Bob";
//     fireEvent.change(assigneeSelect, { target: { value: newAssignee } });

//     expect(handleOnSelectChange).toHaveBeenCalledTimes(1);
//     expect(handleOnSelectChange).toHaveBeenCalledWith(expect.any(Object));
//   });
});
