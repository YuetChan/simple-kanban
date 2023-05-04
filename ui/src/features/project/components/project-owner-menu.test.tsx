import { Provider } from 'react-redux';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ProjectOwnerMenu from './project-owner-menu';
import * as ProjectsService from '../services/projects-service';

jest.mock('../services/projects-service');

const mockStore = configureMockStore([thunk]);

describe("ProjectOwnerMenu", () => {
    let store: any = mockStore({
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

    const ownerMenuAnchorEl = document.createElement('div');

    const handleOnOwnerMenuClose = jest.fn();

    // Mock updateProjectById and window.alert
    jest.mock("../services/projects-service", () => ({
        updateProjectById: jest.fn()
    }));


    it("Inputting secret and collaborator email should update project by id after clicking add collaborator button", async () => {
        const updateProjectByIdSpy = jest.spyOn(ProjectsService, "updateProjectById")
        .mockImplementation((
            id, 
            project, 
            collaboratorEmailSecretMap
            ) => Promise.resolve({
                data: { }, // Add some data here if needed
                status: 200,
                statusText: 'OK',
                headers: { },
                config: { }
            }));
    
        render(
            <Provider store={ store }>
                <ProjectOwnerMenu
                    ownerMenuAnchorEl={ ownerMenuAnchorEl }
                    ownerMenuOpen={ true }
                    handleOnOwnerMenuClose={ handleOnOwnerMenuClose } />
            </Provider>
        );
    
        const collaboratorAddEmailInput = screen.getByLabelText("Email to add");

        fireEvent.change(collaboratorAddEmailInput, { target: { value: "test_user4@example.com" } });

        const secretInput = screen.getByLabelText("Secret");

        fireEvent.change(secretInput, { target: { value: "Test secret" } });    

        const collaboratorAddMenuItem = screen.getByRole("menuitem", { name: /add a collaborator/i })

        fireEvent.click(collaboratorAddMenuItem)

        await waitFor(() => expect(updateProjectByIdSpy).toHaveBeenCalledWith(
            "1",
            {
              id: "1",
              collaboratorList: [
                  { email: "test_user2@example.com" }, 
                  { email: "test_user3@example.com" },
                  { email: "test_user4@example.com" }
              ],
            },
            {
                "test_user4@example.com": "Test secret"
            }
          ));
      });


      it("Inputting secret and collaborator email should alert 'Collaborator added' after clicking add collaborator button", async () => {
        const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => { });

        jest.spyOn(ProjectsService, "updateProjectById")
        .mockImplementation((
            id, 
            project, 
            collaboratorEmailSecretMap
            ) => Promise.resolve({
                data: { }, // Add some data here if needed
                status: 200,
                statusText: 'OK',
                headers: { },
                config: { }
            }));
    
        render(
            <Provider store={ store }>
                <ProjectOwnerMenu
                    ownerMenuAnchorEl={ ownerMenuAnchorEl }
                    ownerMenuOpen={ true }
                    handleOnOwnerMenuClose={ handleOnOwnerMenuClose }
                />
            </Provider>
        );
    
        const collaboratorAddEmailInput = screen.getByLabelText("Email to add");

        fireEvent.change(collaboratorAddEmailInput, { target: { value: "test_user4@example.com" } });

        const secretInput = screen.getByLabelText("Secret");

        fireEvent.change(secretInput, { target: { value: "Test secret" } });    

        const collaboratorAddMenuItem = screen.getByRole("menuitem", { name: /add a collaborator/i })

        fireEvent.click(collaboratorAddMenuItem)

        await waitFor(() => expect(alertSpy).toHaveBeenCalledWith("Collaborator added"));
      });


      it("Inputting collaborator email should update project by id after clicking remove collaborator button", async () => {
        const updateProjectByIdSpy = jest.spyOn(ProjectsService, "updateProjectById")
        .mockImplementation((
            id, 
            project, 
            collaboratorEmailSecretMap
            ) => Promise.resolve({
                data: { }, // Add some data here if needed
                status: 200,
                statusText: 'OK',
                headers: { },
                config: { }
            }));
    
        render(
            <Provider store={ store }>
                <ProjectOwnerMenu
                    ownerMenuAnchorEl={ ownerMenuAnchorEl }
                    ownerMenuOpen={ true }
                    handleOnOwnerMenuClose={ handleOnOwnerMenuClose }
                />
            </Provider>
        );
    
        const collaboratorRemoveEmailInput = screen.getByLabelText("Email to remove");

        fireEvent.change(collaboratorRemoveEmailInput, { target: { value: "test_user3@example.com" } });  

        const collaboratorRemoveMenuItem = screen.getByRole("menuitem", { name: /remove a collaborator/i })

        fireEvent.click(collaboratorRemoveMenuItem)

        await waitFor(() => expect(updateProjectByIdSpy).toHaveBeenCalledWith(
            "1",
            {
              id: "1",
              collaboratorList: [
                  { email: "test_user2@example.com" }, 
              ],
            },
            new Map()
          ));
      });


      it("Inputting collaborator email should should alert 'Collaborator removed' after clicking remove collaborator button", async () => {
        const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => { });

        jest.spyOn(ProjectsService, "updateProjectById")
        .mockImplementation((
            id, 
            project, 
            collaboratorEmailSecretMap
            ) => Promise.resolve({
                data: { }, // Add some data here if needed
                status: 200,
                statusText: 'OK',
                headers: { },
                config: { }
            }));
    
        render(
            <Provider store={ store }>
                <ProjectOwnerMenu
                    ownerMenuAnchorEl={ ownerMenuAnchorEl }
                    ownerMenuOpen={ true }
                    handleOnOwnerMenuClose={ handleOnOwnerMenuClose }
                />
            </Provider>
        );
    
        const collaboratorRemoveEmailInput = screen.getByLabelText("Email to remove");

        fireEvent.change(collaboratorRemoveEmailInput, { target: { value: "test_user3@example.com" } });  

        const collaboratorRemoveMenuItem = screen.getByRole("menuitem", { name: /remove a collaborator/i })

        fireEvent.click(collaboratorRemoveMenuItem)

        await waitFor(() => expect(alertSpy).toHaveBeenCalledWith("Collaborator removed"));
      });


      it("Closing dialog should should call handleOnOwnerMenuClose", async () => {
        jest.spyOn(ProjectsService, "updateProjectById")
        .mockImplementation((
            id, 
            project, 
            collaboratorEmailSecretMap
            ) => Promise.resolve({
                data: { }, // Add some data here if needed
                status: 200,
                statusText: 'OK',
                headers: { },
                config: { }
            }));
    
        render(
            <Provider store={ store }>
                <ProjectOwnerMenu
                    ownerMenuAnchorEl={ ownerMenuAnchorEl }
                    ownerMenuOpen={ true }
                    handleOnOwnerMenuClose={ handleOnOwnerMenuClose }
                />
            </Provider>
        );
    
        const menu = screen.getByRole('menu');

        fireEvent.keyDown(menu, { key: "Escape", code: 27 });    

        expect(handleOnOwnerMenuClose).toBeCalledTimes(1);
      });
})