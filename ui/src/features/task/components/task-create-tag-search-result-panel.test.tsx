import { render, screen, fireEvent } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Provider } from 'react-redux';

import TaskCreateTagsSearchResultPanel from './task-create-tags-search-result-panel';

import * as TagsService from "../../tag/services/tags-service"

jest.mock("../../tag/services/tags-service");

const mockStore = configureMockStore([thunk]);

describe('TaskCreateTagSearchPanel', () => {
    let store: any = mockStore({ 
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
    });

    let props: { }

    beforeEach(() => {
        props = { }

        jest.mock("../../tag/services/tags-service", () => ({
            searchTagsByProjectIdAndPrefix: jest.fn()
        }));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });


    it('initialzation should call searchTagsByProjectIdAndPrefix', () => {
        jest.spyOn(TagsService, "searchTagsByProjectIdAndPrefix")
        .mockImplementation((
            projectId, 
            searchString, 
            page
            ) => Promise.resolve({
                tags: [], // Add some data here if needed
                page: 0,
                totalPage: 1
            }));

        render(
            <Provider store={ store }>
                <TaskCreateTagsSearchResultPanel { ... props} />
            </Provider>
        );
    });

});