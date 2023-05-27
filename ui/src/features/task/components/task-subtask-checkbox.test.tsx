import { fireEvent, render, screen } from "@testing-library/react";

import configureMockStore from "redux-mock-store";

import thunk from "redux-thunk";

import { Provider } from "react-redux";

import TaskSubtaskCheckbox from "./task-subtask-checkbox";

const mockStore = configureMockStore([thunk]);

describe("TaskSubTaskCheckbox", () => {
    let store: any = mockStore({ 
        UserCache: {
          _loginedUserEmail: "test_user1@example.com",
        },
    });

    let props: { 
        subtaskList: Array<string>,
        checkedValues: Array<string>,
    
        showDelete?: boolean,
    
        handleOnSubtaskCheck?: Function,
        handleOnSubtaskDelete?: Function,
    }

    beforeEach(() => {
        props = { 
            subtaskList:[],
            checkedValues: [],
        
            showDelete: true,
        
            handleOnSubtaskCheck: jest.fn(),
            handleOnSubtaskDelete: jest.fn(),
        }
    });


    it("render correctly", () => {
        render(
            <Provider store={ store }>
                <TaskSubtaskCheckbox 
                    { ... props } 
                    subtaskList={ ["test_subtask_1"] }
                    />
            </Provider>
        );

        const subtask1Form = screen.getByLabelText("test_subtask_1"); 
        const subtask1CloseIconButton = screen.getByTestId("test_subtask_1" + "-subtask-close-icon-button");    

        expect(subtask1Form).toBeInTheDocument();
        expect(subtask1CloseIconButton).toBeInTheDocument();    
    });


    it("clicking checkbox should call handleOnSubtaskCheck", () => {
        render(
            <Provider store={ store }>
                <TaskSubtaskCheckbox 
                    { ... props } 
                    subtaskList={ ["test_subtask_1"] }
                    />
            </Provider>
        );

        const subtask1Form = screen.getByLabelText("test_subtask_1"); 
        
        fireEvent.click(subtask1Form);

        expect(props.handleOnSubtaskCheck).toHaveBeenCalledWith(["test_subtask_1"]);
    });


    it("clicking close icon button should call handleOnSubtaskDelete", () => {
        render(
            <Provider store={ store }>
                <TaskSubtaskCheckbox 
                    { ... props } 
                    subtaskList={ ["test_subtask_1"] }
                    />
            </Provider>
        );

        const subtask1CloseIconButton = screen.getByTestId("test_subtask_1" + "-subtask-close-icon-button"); 

        fireEvent.click(subtask1CloseIconButton);

        expect(props.handleOnSubtaskDelete).toHaveBeenCalledWith("test_subtask_1");
    });
})