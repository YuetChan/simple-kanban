import { Provider } from 'react-redux';

import { render, fireEvent, screen, waitFor  } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ProjectCollaboratorMenu from './project-collaborator-menu';

import * as ProjectsService from '../services/projects-service';

const mockStore = configureMockStore([thunk]);

describe('ProjectCollaboratorMenu', () => {
    let store: any;

    let props: {
        collaboratorsMenuAnchorEl: any,
        collaboratorsMenuOpen: boolean,
        
        handleOnCollaboratorsMenuClose?: Function
    }
  
    // Mock updateProjectById and window.alert
    jest.mock('../services/projects-service', () => ({
        updateProjectById: jest.fn()
    }));


    beforeEach(() => {
        store = mockStore({
            ProjectsCache: {
                _activeProject: {
                    id: '1',
                    collaboratorList: [
                    { email: 'user2@example.com' },
                    { email: 'user3@example.com' },
                    ],
                },
            },
            UserCache: {
                _loginedUserEmail: 'user1@example.com',
            },
        });

        props = {
            collaboratorsMenuAnchorEl: document.body,
            collaboratorsMenuOpen: true,
            handleOnCollaboratorsMenuClose: jest.fn()
        };
    });

    
    it('clicking quit project menu item should update project by id', async () => {
        const updateProjectByIdSpy = jest.spyOn(ProjectsService, 'updateProjectById')
        .mockImplementation((
            id, 
            project
            ) => Promise.resolve({
                data: { }, // Add some data here if needed
                status: 200,
                statusText: 'OK',
                headers: { },
                config: { }
            }));

        render(
          <Provider store={ store }>
            <ProjectCollaboratorMenu { ... props } />
          </Provider>
        );
    
        const quitProjectMenuItem = screen.getByRole('menuitem', { name: /quit project/i });

        fireEvent.click(quitProjectMenuItem);
    
        await waitFor(() => expect(updateProjectByIdSpy).toHaveBeenCalledWith(
            '1',
            {
              id: '1',
              collaboratorList: [
                  { email: 'user2@example.com' }, 
                  { email: 'user3@example.com' }
              ],
            },
            new Map()
          ))
    })


    it("clicking quit project menu item should alert 'You are removed from project'", async () => {
        const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => { });

        jest.spyOn(ProjectsService, "updateProjectById")
        .mockImplementation((
            id, 
            project
            ) => Promise.resolve({
                data: { }, // Add some data here if needed
                status: 200,
                statusText: 'OK',
                headers: { },
                config: { }
            }));

        render(
          <Provider store={ store }>
            <ProjectCollaboratorMenu { ... props } />
          </Provider>
        );
    
        const quitProjectMenuItem = screen.getByRole('menuitem', { name: /quit project/i });

        fireEvent.click(quitProjectMenuItem);
    
        await waitFor(() => expect(alertSpy).toHaveBeenCalledWith("You are removed from project"));
    })
})