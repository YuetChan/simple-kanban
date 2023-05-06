import { render, waitFor, screen } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Provider } from 'react-redux';

import TaskCreateTagsSearchResultPanel from './task-create-tags-search-result-panel';

import * as TagsService from "../../tag/services/tags-service"

const mockStore = configureMockStore([thunk]);

let mockTagArea = jest.fn();

jest.mock("../../tag/components/tag-area", () => (props: any) => {
    mockTagArea(props);
    return (
        <div data-testid="tag-area">
            { 
                props.showDelete
                ?<div data-testid="delete-icon"></div>
                : null
            }
            { props.tag }
        </div>
    )
});

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
        mockTagArea.mockClear();
    });


    it('initialzation should call searchTagsByProjectIdAndPrefix', async () => {
        const searchTagsByProjectIdAndPrefixSpy = jest.spyOn(TagsService, "searchTagsByProjectIdAndPrefix")
        .mockImplementation((
            projectId, 
            searchString, 
            page
            ) => Promise.resolve({
                tags: [], 
                page: 0,
                totalPage: 1
            }));
        
        render(
            <Provider store={ store }>
                <TaskCreateTagsSearchResultPanel { ... props} />
            </Provider>
        );

        await waitFor(() => expect(searchTagsByProjectIdAndPrefixSpy).toHaveBeenCalledWith("1", "", 0), 
        { timeout: 2000 });
    });


    it('render correctly', async () => {
        jest.spyOn(TagsService, "searchTagsByProjectIdAndPrefix")
        .mockImplementation((
            projectId, 
            searchString, 
            page
            ) => Promise.resolve({
                tags: [{ name: "Test tag 1" }, { name: "Test tag 2" }, ], 
                page: 0,
                totalPage: 1
            }));

        render(
            <Provider store={ store }>
                <TaskCreateTagsSearchResultPanel { ... props} />
            </Provider>
        );

        await waitFor(() => expect(screen.getAllByTestId("tag-area")).toHaveLength(2), 
        { timeout: 2000 });
      });
});