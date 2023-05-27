import { fireEvent, render, screen } from "@testing-library/react";

import configureMockStore from "redux-mock-store";

import thunk from "redux-thunk";

import { Provider } from "react-redux";

import TaskSubtaskListArea from "./task-subtask-list-area";

const mockStore = configureMockStore([thunk]);

describe("TaskSubTaskListArea", () => {
    let store: any = mockStore({ 
        UserCache: {
          _loginedUserEmail: "test_user1@example.com",
        },
    });

    let props: { 
        subtasks?: Array<string>,
        checkedValues?: Array<string>
    
        showDelete?: boolean,
    
        handleOnSubtaskCheck?: Function,
        handleOnSubtaskChange?: Function
    }

    beforeEach(() => {
        props = { 
            subtasks:[],
            checkedValues: [],
        
            showDelete: true,
        
            handleOnSubtaskCheck: jest.fn(),
            handleOnSubtaskChange: jest.fn(),
        }
    });


    it("render correctly", () => {
        render(
            <Provider store={ store }>
                <TaskSubtaskListArea 
                    { ... props } 
                    subtasks={ ["test_subtask_1"] }
                    />
            </Provider>
        );

        const titleWithIcon = screen.getByText("Subtasks:")    

        const subtaskTextfield = screen.getByLabelText("Enter subtasks");    

        const subtask1Form = screen.getByLabelText("test_subtask_1"); 
        const subtask1CloseIconButton = screen.getByTestId("test_subtask_1" + "-subtask-close-icon-button");    

        expect(titleWithIcon).toBeInTheDocument();    

        expect(subtaskTextfield).toBeInTheDocument();    

        expect(subtask1Form).toBeInTheDocument();
        expect(subtask1CloseIconButton).toBeInTheDocument();    
    });


    it("Entering subtask on textfield should call handleOnSubtaskChange", () => {
        render(
            <Provider store={ store }>
               <TaskSubtaskListArea 
                    { ... props } 
                    subtasks={ ["test_subtask_1"] }
                    />
            </Provider>
        );

        const subtaskTextfield = screen.getByLabelText("Enter subtasks");   

        fireEvent.change(subtaskTextfield, { target: { value: "test_subtask_2" } });
        fireEvent.keyDown(subtaskTextfield, { key: 'Enter', keyCode: 13 })

        expect(props.handleOnSubtaskChange).toBeCalledWith(["test_subtask_1", "test_subtask_2"], []);
    });


    it("clicking close icon button should call handleOnSubtaskChange", () => {
        render(
            <Provider store={ store }>
                <TaskSubtaskListArea
                    { ... props } 
                    subtasks={ ["test_subtask_1"] }
                    />
            </Provider>
        );

        const subtask1CloseIconButton = screen.getByTestId("test_subtask_1" + "-subtask-close-icon-button"); 

        fireEvent.click(subtask1CloseIconButton);

        expect(props.handleOnSubtaskChange).toHaveBeenCalledWith([], []);
    });

    
    it("clicking checkbox should call handleOnSubtaskCheck", () => {
        render(
            <Provider store={ store }>
                <TaskSubtaskListArea
                    { ... props } 
                    subtasks={ ["test_subtask_1"] }
                    />
            </Provider>
        );

        const subtask1Form = screen.getByLabelText("test_subtask_1"); 
        
        fireEvent.click(subtask1Form);

        expect(props.handleOnSubtaskCheck).toHaveBeenCalledWith(["test_subtask_1"]);
    });
})