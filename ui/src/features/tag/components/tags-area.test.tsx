import { fireEvent, render, screen } from "@testing-library/react";

import configureMockStore from "redux-mock-store";

import thunk from "redux-thunk";

import { Provider } from "react-redux";

import TagsArea from "./tags-area";

const mockStore = configureMockStore([thunk]);

describe("TagsArea", () => {
    let store: any = mockStore({
        UserCache: {
          _loginedUserEmail: "test_user1@example.com",
        },
    });

    let props: {
        projectId: string,
        tags?: Array<string>,
    
        handleOnTagsChange?: Function
    };

    beforeEach(() => {
        store = mockStore({
            UserCache: {
                _loginedUserEmail: "test_user1@example.com",
            },
        });

        props = {
            projectId: "",
            tags: [],
        
            handleOnTagsChange: jest.fn()
        };
    });


    it("renders correctly", () => {
        render(
            <Provider store={ store }>
                <TagsArea { ...props } />
            </Provider>
        );

        const titleIcon = screen.getByText("Tags:");

        expect(titleIcon).toBeInTheDocument();
    });


    it("deleteing tag should call handleOnTagsChange", () => {
        render(
            <Provider store={ store }>
                <TagsArea { ...props } tags={ [ "test_tag_1", "test_tag_2" ] }/>
            </Provider>
        );

        const tag_1 = screen.getByTestId("test_tag_1" + "tag-chip-delete-icon-button")

        fireEvent.click(tag_1);

        expect(props.handleOnTagsChange).toBeCalledTimes(1)
    });


    it("entering tag on textfield should call handleOnTagsChange", () => {
        render(
            <Provider store={ store }>
                <TagsArea { ...props } tags={ [ "test_tag_1", "test_tag_2" ] }/>
            </Provider>
        );

        const tagTextfield = screen.getByLabelText("Enter tags")

        fireEvent.change(tagTextfield, { target: { value: "test_tag_3" } });
        fireEvent.keyDown(tagTextfield, { key: 'Enter', keyCode: 13 })

        expect(props.handleOnTagsChange).toBeCalledTimes(1)
    });


    it("entering duplicate tag on textfield should not call handleOnTagsChange", () => {
        render(
            <Provider store={ store }>
                <TagsArea { ...props } tags={ [ "test_tag_1", "test_tag_2" ] }/>
            </Provider>
        );

        const tagTextfield = screen.getByLabelText("Enter tags")

        fireEvent.change(tagTextfield, { target: { value: "test_tag_1" } });
        fireEvent.keyDown(tagTextfield, { key: 'Enter', keyCode: 13 })

        expect(props.handleOnTagsChange).toBeCalledTimes(0)
    });


    // Currently cant test clicking menu item on the tags dropdown

});
