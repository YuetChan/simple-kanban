import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Provider } from 'react-redux';

import TagsEditArea from "./tags-edit-area";

const mockStore = configureMockStore([thunk]);

describe("TagsEditArea", () => {
    let store: any = mockStore({ });

    let props: {
        label?: string,
        disabled?: boolean,
        inputRef?: any,
        tags?: Array<string>,
        
        handleOnTagsChange?: Function,
        handleOnTextFieldChange?: Function,
        handleOnKeyPress?: Function,
        handleOnFocus?: Function,
        handleOnBlur?: Function
    }

    beforeEach(() => {
        store = mockStore({ });

        props = {
            label: "Test tag edit area",
            disabled: false,
            inputRef: null,
            tags: ["Test tag 1"],
            
            handleOnTagsChange: jest.fn(),
            handleOnTextFieldChange: jest.fn(),
            handleOnKeyPress: jest.fn(),
            handleOnFocus: jest.fn(),
            handleOnBlur: jest.fn()
        } 
    })

    afterEach(() => {
        jest.restoreAllMocks();
    });


    it("renders correctly", () => {
        render(
            <Provider store={ store }>
                <TagsEditArea { ... props }/>
            </Provider>
            );

        const textField = screen.queryByText("Test tag 1")

        expect(textField).toBeInTheDocument()
    });


    it("Inputting text and pressing enter should add tag", async () => {
        render(
            <Provider store={ store }>
                <TagsEditArea { ... props }/>
            </Provider>
            );

        const textFieldInput = screen.getByLabelText("Test tag edit area");

        fireEvent.change(textFieldInput, { target: { value: "Test tag 2" } });

        fireEvent.keyDown(textFieldInput, { keyCode: 13 });

        const tag_1 = screen.queryByText("Test tag 1")
        const tag_2 = screen.queryByText("Test tag 2")

        expect(tag_2).toBeInTheDocument()

        await waitFor(() => expect(tag_1).toBeInTheDocument())
        await waitFor(() => expect(tag_2).toBeInTheDocument())
    });


    it("Inputting text and pressing enter should not add tag when tag with same text existed", async () => {
        render(
            <Provider store={ store }>
                <TagsEditArea { ... props }/>
            </Provider>
            );

        const textFieldInput = screen.getByLabelText("Test tag edit area");

        fireEvent.change(textFieldInput, { target: { value: "Test tag 2" } });

        fireEvent.keyDown(textFieldInput, { keyCode: 13 });

        fireEvent.change(textFieldInput, { target: { value: "Test tag 2" } });

        fireEvent.keyDown(textFieldInput, { keyCode: 13 });

        const tag_2 = screen.queryAllByText("Test tag 2")

        await waitFor(() => expect(tag_2).toHaveLength(1))
    });

});