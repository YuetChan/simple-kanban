import { Provider } from 'react-redux';

import { render, fireEvent, screen } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ProjectCreateDialog from "./project-create-dialog";

const mockStore = configureMockStore([thunk]);

describe('ProjectCreateDialog', () => {
    let store: any;

    let props: {
        open?: boolean,
        title?: string,
        description?: string,
        showLogout?: boolean,
      
        handleOnProjectCreate?: Function,
        handleOnLogout?: Function,
        handleOnClose?: Function
    };
    

    beforeEach(() => {
        store = mockStore({
            UserCache: {
              _loginedUserEmail: 'test_user1@example.com',
            },
        });

        props = {
            open: true,
            title: "Test Title",
            description: "Test Description",
            showLogout: true,
    
            handleOnProjectCreate: jest.fn(),
            handleOnLogout: jest.fn(),
            handleOnClose: jest.fn()
        };
    
    })


    it("renders correctly", () => {
        render(
            <Provider store={ store }>
                <ProjectCreateDialog {... props } />
            </Provider>
        );

        // 
        expect(screen.getByText( "Test Title" )).toBeInTheDocument();
        expect(screen.getByText( "Test Description" )).toBeInTheDocument();
    });
    

    it("Inputting textfield should change project name", () => {
        render(
            <Provider store={ store }>
                <ProjectCreateDialog {... props} />
            </Provider>
        );

        const projectNameInput = screen.getByLabelText("Project name");

        fireEvent.change(projectNameInput, { target: { value: "Test Project" } });

        expect(projectNameInput).toHaveValue('Test Project');
    });


    it("Clicking logout button should call handleOnLogout", () => {
        render(
            <Provider store={ store }>
                <ProjectCreateDialog { ... props } />
            </Provider>
        );

        const logoutButton = screen.getByRole('button', { name: /logout/i });

        fireEvent.click(logoutButton);

        expect(props.handleOnLogout).toHaveBeenCalledTimes(1);
    });
    

    it("Clicking close button should call handleOnClose", () => {   
        render(
            <Provider store={ store }>
                <ProjectCreateDialog { ... props } />
            </Provider>
        );

        const dialog = screen.getByRole('dialog');

        fireEvent.keyDown(dialog, { key: "Escape", code: 27 });
        
        expect(props.handleOnClose).toHaveBeenCalledTimes(1);
    });


    it("Clicking close button should empty project name", () => {
        render(
            <Provider store={ store }>
                <ProjectCreateDialog { ... props } />
            </Provider>
        );

        const dialog = screen.getByRole('dialog');

        fireEvent.keyDown(dialog, { key: "Escape", code: 27 });

        const projectNameInput = screen.getByLabelText("Project name");

        expect(projectNameInput).toHaveValue('');
    });


    it("Clicking create button should call handleOnProjectCreate", () => {  
        render(
            <Provider store={ store }>
                <ProjectCreateDialog { ...props } />
            </Provider>
        );

        const createButton = screen.getByRole('button', { name: /create/i });

        fireEvent.click(createButton);

        expect(props.handleOnProjectCreate).toHaveBeenCalledTimes(1);
    });
})