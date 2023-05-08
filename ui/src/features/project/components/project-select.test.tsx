import { render, screen } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Provider } from 'react-redux';
import ProjectSelect from './project-select';
import { Project } from '../../../types/Project';

const mockStore = configureMockStore([thunk]);

describe('ProjectSelect component', () => {
    let store: any = mockStore({
        ProjectsCache: {
            _activeProject: {
              id: "1",
              collaboratorList: [
                { email: "test_user2@example.com" },
                { email: "test_user3@example.com" },
              ],
            },
            _allProjects: [ {
                id: "1",
                name: "Test project name ",
                userEmail: "test_user1@example.com",
              
                collaboratorList: [                
                    { email: "test_user2@example.com" },
                    { email: "test_user3@example.com" }
                ],
                projectUUID: {
                    uuid1: "uuid1",
                    uuid2: "uuid2",
                    uuid3: "uuid3",
                    uuid4: "uuid4",
                    uuid5: "uuid5",
                    uuid6: "uuid6",
                    uuid7: "uuid7",
                    uuid8: "uuid8"
                },
            } ]
        },
        UserCache: {
          _loginedUserEmail: 'test_user1@example.com',
        },
    });

    const handleProjectChange = jest.fn();

    // The rendered menu item will have 'button' role
    it("renders correctly", () => {
        const activeProject  = {
            id: "1",
            collaboratorList: [
              { email: "test_user2@example.com" },
              { email: "test_user3@example.com" },
            ],
        } as Project

        const projects = [
            {
                id: "1",
                name: "Test project name ",
                userEmail: "test_user1@example.com",
              
                collaboratorList: [                
                    { email: "test_user2@example.com" },
                    { email: "test_user3@example.com" }
                ],
                projectUUID: {
                    uuid1: "uuid1",
                    uuid2: "uuid2",
                    uuid3: "uuid3",
                    uuid4: "uuid4",
                    uuid5: "uuid5",
                    uuid6: "uuid6",
                    uuid7: "uuid7",
                    uuid8: "uuid8"
                },
            }
        ] as Array<Project>

        render(
        <Provider store={ store }>
            <ProjectSelect 
                activeProject={ activeProject }
                projects = { projects }
                yourProjectDisabled={ false } 
                handleOnProjectChange={ handleProjectChange } 
                />
        </Provider>
       );

        expect(screen.getByRole('button', { name: /Test project name/i })).toBeInTheDocument()
    });
})