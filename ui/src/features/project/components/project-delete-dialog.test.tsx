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
        props = {
            open: true,
            label: "Delete dialog",
            handleOnClose: jest.fn(),
            handleOnDelete: jest.fn()
        }; 

        store = mockStore({
            UserCache: {
              _loginedUserEmail: 'test_user1@example.com',
            },
        })
    })


    it("closing a delete dialog should remove dialog from dom", () => {
        render(
            <Provider store={ store }>
                <ProjectDeleteDialog {... props } open={ false }/>
            </Provider>
        );

        expect(screen.queryByText(/Please enter DELETE to confirm the deletion/i)).not.toBeInTheDocument();
    });


    it("Inputting textfield should change 'Enter DELETE' value", () => {
        render(
            <Provider store={ store }>
                <ProjectDeleteDialog {... props } open={ true }/>
            </Provider>
        );

        const enterDeleteInput = screen.getByLabelText("Enter DELETE");

        fireEvent.change(enterDeleteInput, { target: { value: "DELETE" } });

        expect(enterDeleteInput).toHaveValue("DELETE");
    });


    it("Clicking cancel should call handleOnClose", () => {
        render(
            <Provider store={ store }>
                <ProjectDeleteDialog {... props } open={ true }/>
            </Provider>
        );

        const cancelButton = screen.getByRole("button", { name: /cancel/i });

        fireEvent.click(cancelButton)

        expect(props.handleOnClose).toHaveBeenCalledTimes(1);
    });


    it("Closing dialog should call handleOnClose", () => {
        render(
            <Provider store={ store }>
                <ProjectDeleteDialog {... props } open={ true }/>
            </Provider>
        );

        const dialog = screen.getByRole('dialog');

        fireEvent.keyDown(dialog, { key: "Escape", code: 27 });

        expect(props.handleOnClose).toHaveBeenCalledTimes(1);
    });
})