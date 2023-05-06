import { render } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Provider } from 'react-redux';

import TaskCreateDialog from './task-create-dialog';

const mockStore = configureMockStore([thunk]);

describe('TaskCreateDialog', () => {
    let store: any = mockStore({ 
        TasksCache: {
            _allTasks: {
                'backlog': [],
                'todo': [],
                'inProgress': [],
                'done': []
              }
        },

        TaskCreate: {
            _tagsEditAreaFocused: false,
            _tagsEditAreaSearchStr: "",
            _tagsEditAreaRef: undefined,
          
            _activeTags: [],
          
            _task: undefined,
          
            _searchResultPanelMouseOver: false,
            
            _lastFocusedArea: ""
        },

        ProjectsCache: {
            _activeProject: {
              id: "1",
              collaboratorList: [
                { email: "test_user2@example.com" },
                { email: "test_user3@example.com" },
              ],
            },
        },

        UserCache: {
          _loginedUserEmail: "test_user1@example.com",
        },

        DatesCache: {
            _fromDate: new Date(),
            _toDate: new Date(),
            _dueDate: new Date()
          }
    });

    let props: {
        label?: string,
        open?: boolean,
      
        handleOnApply?: Function,
        handleOnClose?: Function
    }

    beforeEach(() => {
        props = {
            label: "Test task create dialog",
            open: true,

            handleOnApply: jest.fn(),
            handleOnClose: jest.fn()
        }
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });


    it('renders correctly', () => {
        render(
            <Provider store={ store }>
                <TaskCreateDialog { ... props} />
            </Provider>
        );
    });

});