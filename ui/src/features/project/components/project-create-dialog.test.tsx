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
            title: "",
            description: "",
    
            handleOnProjectCreate: jest.fn(),
            handleOnClose: jest.fn()
        };
    })


    it("renders correctly", () => {
        render(
            <Provider store={ store }>
                <ProjectCreateDialog {... props } />
            </Provider>
        );

        expect(screen.getByLabelText("Enter name")).toBeInTheDocument(); 
        expect(screen.getByLabelText("Enter description")).toBeInTheDocument(); 
    });
    

    it("Create project should call handleOnProjectCreate with inputted project name and description", () => {
        render(
            <Provider store={ store }>
                <ProjectCreateDialog {... props} />
            </Provider>
        );

        const projectNameTextfield = screen.getByLabelText("Enter name");

        fireEvent.change(projectNameTextfield, { target: { value: "Test name" } });

        const projectDescriptionTextfield = screen.getByLabelText("Enter description");

        fireEvent.change(projectDescriptionTextfield, { target: { value: "Test description" } });

        const createButton = screen.getByText("Create");

        fireEvent.click(createButton);

        expect(props.handleOnProjectCreate).toBeCalledWith("Test name", "Test description")
    });
})