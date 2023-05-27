import { Provider } from 'react-redux';

import { fireEvent, render, screen } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ProjectOwnerMenu from './project-owner-menu';

const mockStore = configureMockStore([thunk]);

describe("ProjectOwnerMenu", () => {
    let store: any = mockStore({
        UserCache: {
          _loginedUserEmail: "test_user1@example.com",
        },
    });

    let props: {
        anchorEl: any,
        open: boolean,
    
        handleOnOwnerMenuClose?: Function,
    
        handleOnCollaboratorAdd?: Function,
        handleOnCollaboratorRemove?: Function,
    
        handleOnNewProjectNameUpdate?: Function,
        handleOnNewProjectDescriptionUpdate?: Function,
    
        handleOnProjectDelete?: Function
    }

    beforeEach(() => {
        store = mockStore({
            UserCache: {
                _loginedUserEmail: 'test_user1@example.com',
            },
        });

        props = {
            anchorEl: document.body,
            open: true,
            
            handleOnOwnerMenuClose: jest.fn(),
    
            handleOnCollaboratorAdd: jest.fn(),
            handleOnCollaboratorRemove: jest.fn(),
        
            handleOnNewProjectNameUpdate: jest.fn(),
            handleOnNewProjectDescriptionUpdate: jest.fn(),
        
            handleOnProjectDelete: jest.fn()
        }; 
    })

    it("Render correctly", () => {    
        render(
            <Provider store={ store }>
                <ProjectOwnerMenu { ... props } />
            </Provider>
        );
    
        const collaboratorAddEmailTextfield = screen.getByLabelText("Email to add");
        const collaboratorRemoveEmailTextfield = screen.getByLabelText("Email to remove");

        const projectNameTextfield = screen.getByLabelText("Project name");
        const projectDescription = screen.getByLabelText("Project description")   

        const deleteProjectButton = screen.getByRole("button", { name: "Delete project" })    

        expect(collaboratorAddEmailTextfield).toBeInTheDocument();
        expect(collaboratorRemoveEmailTextfield).toBeInTheDocument();

        expect(projectNameTextfield).toBeInTheDocument();
        expect(projectDescription).toBeInTheDocument();

        expect(deleteProjectButton).toBeInTheDocument();
    });


    it("Clicking collaborator add icon should call handleOnCollaboratorAdd", async () => {
        render(
            <Provider store={ store }>
                <ProjectOwnerMenu { ... props } />
            </Provider>
        );
    
        const collaboratorAddIconButton = screen.getByTestId("collaborator-add-icon-button")

        fireEvent.click(collaboratorAddIconButton);

        expect(props.handleOnCollaboratorAdd).toBeCalledTimes(1);
    });


    it("Clicking collaborator remove icon should call handleOnCollaboratorRemove", async () => {
        render(
            <Provider store={ store }>
                <ProjectOwnerMenu { ... props } />
            </Provider>
        );
    
        const collaboratorRemoveIconButton = screen.getByTestId("collaborator-remove-icon-button")

        fireEvent.click(collaboratorRemoveIconButton);

        expect(props.handleOnCollaboratorRemove).toBeCalledTimes(1);
    });  


    it("Clicking project name update icon should call handleOnNewProjectNameUpdate", async () => {
        render(
            <Provider store={ store }>
                <ProjectOwnerMenu { ... props } />
            </Provider>
        );
    
        const projectNameUpdateIconButton = screen.getByTestId("project-name-update-icon-button")

        fireEvent.click(projectNameUpdateIconButton);

        expect(props.handleOnNewProjectNameUpdate).toBeCalledTimes(1); 
    }); 
    

    it("Clicking project description update icon should call handleOnNewProjectDescriptionUpdate", async () => {
        render(
            <Provider store={ store }>
                <ProjectOwnerMenu { ... props } />
            </Provider>
        );
    
        const projectDescriptionUpdateIconButton = screen.getByTestId("project-description-update-icon-button")

        fireEvent.click(projectDescriptionUpdateIconButton);

        expect(props.handleOnNewProjectDescriptionUpdate).toBeCalledTimes(1); 
    }); 
})