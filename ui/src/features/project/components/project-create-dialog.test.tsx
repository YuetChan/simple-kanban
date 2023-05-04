import { Provider } from 'react-redux';

import { render, fireEvent, screen } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ProjectCreateDialog from "./project-create-dialog";

const mockStore = configureMockStore([thunk]);

describe('ProjectCreateDialog', () => {
    let store: any = mockStore({
        UserCache: {
          _loginedUserEmail: 'test_user1@example.com',
        },
    });

    const props = {
        open: true,
        title: "Test Title",
        description: "Test Description",
        showLogout: true,

        handleOnProjectCreateClick: jest.fn(),
        handleOnLogout: jest.fn(),
        handleOnClose: jest.fn()
    };

    const handleOnProjectCreateClick = jest.fn();
    const handleOnLogout = jest.fn();
    const handleOnClose = jest.fn();
    

    it("renders correctly", () => {
        render(
            <Provider store={ store }>
                <ProjectCreateDialog {... props } />
            </Provider>
        );

        expect(screen.getByText( props.title )).toBeInTheDocument();
        expect(screen.getByText( props.description )).toBeInTheDocument();
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
                <ProjectCreateDialog { ... props } handleOnLogout={ handleOnLogout } />
            </Provider>
        );

        const logoutButton = screen.getByRole('button', { name: /logout/i });

        fireEvent.click(logoutButton);

        expect(handleOnLogout).toHaveBeenCalledTimes(1);
    });
    

    it("Clicking close button should call handleOnClose", () => {   
        render(
            <Provider store={ store }>
                <ProjectCreateDialog { ... props } handleOnClose={ handleOnClose } />
            </Provider>
        );

        const dialog = screen.getByRole('dialog');

        fireEvent.keyDown(dialog, { key: "Escape", code: 27 });
        
        expect(handleOnClose).toHaveBeenCalledTimes(1);
    });


    it("Clicking close button should empty project name", () => {
        render(
            <Provider store={ store }>
                <ProjectCreateDialog { ... props } handleOnClose={ handleOnClose } />
            </Provider>
        );

        const dialog = screen.getByRole('dialog');

        fireEvent.keyDown(dialog, { key: "Escape", code: 27 });

        const projectNameInput = screen.getByLabelText("Project name");

        expect(projectNameInput).toHaveValue('');
    });


    it("Clicking create button should call handleOnProjectCreateClick", () => {  
        render(
            <Provider store={ store }>
                <ProjectCreateDialog { ...props }  handleOnProjectCreateClick={handleOnProjectCreateClick} />
            </Provider>
        );

        const createButton = screen.getByRole('button', { name: /create/i });

        fireEvent.click(createButton);

        expect(handleOnProjectCreateClick).toHaveBeenCalledTimes(1);
    });
})