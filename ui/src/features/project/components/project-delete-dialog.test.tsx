import { Provider } from 'react-redux';

import { render, fireEvent, screen } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ProjectDeleteDialog from './project-delete-dialog';

const mockStore = configureMockStore([thunk]);

describe('ProjectDeleteDialog', () => {
    let store: any;

    let props: {
        open?: boolean,
        label?: string,
        
        handleOnClose?: Function,
        handleOnDelete?: Function
    };

    beforeEach(() => {
        store = mockStore({
            UserCache: {
                _loginedUserEmail: 'test_user1@example.com',
            },
        });

        props = {
            open: true,
            label: "Delete dialog",

            handleOnClose: jest.fn(),
            handleOnDelete: jest.fn()
        }; 
    })

    it("Render correctly", () => {
        render(
            <Provider store={ store }>
                <ProjectDeleteDialog {... props } />
            </Provider>
        );

        expect(screen.getByLabelText("Enter DELETE")).toBeInTheDocument(); 
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument(); 
        expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    });

    it("Entering DELETE should enable Delete button", () => {
        render(
            <Provider store={ store }>
                <ProjectDeleteDialog {... props } />
            </Provider>
        );

        const deleteTextfield = screen.getByLabelText("Enter DELETE");

        fireEvent.change(deleteTextfield, { target: { value: "DELETE" } });    
        
        const deleteButton = screen.getByRole("button", { name: "Delete" })    

        fireEvent.click(deleteButton);

        expect(props.handleOnDelete).toBeCalledTimes(1)  
    });

    it("Delete button should be disable by default", () => {
        render(
            <Provider store={ store }>
                <ProjectDeleteDialog {... props } />
            </Provider>
        );
        
        const deleteButton = screen.getByRole("button", { name: "Delete" });    

        fireEvent.click(deleteButton);

        expect(props.handleOnDelete).toBeCalledTimes(0); 
    });

    it("Clicking cancel button should call handleOnClose", () => {
        render(
            <Provider store={ store }>
                <ProjectDeleteDialog { ... props } />
            </Provider>
        );
        
        const cancelButton = screen.getByRole("button", { name: "Cancel" });    

        fireEvent.click(cancelButton);

        expect(props.handleOnClose).toBeCalledTimes(1); 
    });
})