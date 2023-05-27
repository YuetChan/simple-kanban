import { render, screen, fireEvent } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Provider } from 'react-redux';
import TagChip from './tag-chip';

const mockStore = configureMockStore([thunk]);

describe('TagChip', () => {
    let store: any = mockStore({
        UserCache: {
          _loginedUserEmail: "test_user1@example.com",
        },
    });

    let props: {
        tag: string;
        showDelete: boolean;
        
        handleOnDeleteClick: jest.Mock;
    };

    beforeEach(() => {
        store = mockStore({
            UserCache: {
                _loginedUserEmail: 'test_user1@example.com',
            },
        });

        props = {
            tag: 'Test tag 1',
            showDelete: true,
            
            handleOnDeleteClick: jest.fn(),
        };
    });


    it('renders correctly', () => {
        render(
            <Provider store={ store }>
                <TagChip { ...props } />
            </Provider>
        );

        const tagDiv = screen.getByText(props.tag);
        const closeIconButton = screen.getByTestId(props.tag + "tag-chip-delete-icon-button");

        expect(tagDiv).toBeInTheDocument();
        expect(closeIconButton).toBeInTheDocument();
    });


    it('close icon button should not render when showDelete is false"', () => {
        render(
            <Provider store={ store }>
                <TagChip { ...props } showDelete={ false } />
            </Provider>
        );

        const closeIconButton = screen.queryByTestId(props.tag + "tag-chip-delete-icon-button")

        expect(closeIconButton).not.toBeInTheDocument();
    });


    it('clicking close icon button should call onDeleteClick with props.tag', () => {
        render(
            <Provider store={ store }>
                <TagChip { ...props } />
            </Provider>
        );

        const closeIconButton = screen.getByTestId(props.tag + "tag-chip-delete-icon-button");

        fireEvent.click(closeIconButton);

        expect(props.handleOnDeleteClick).toHaveBeenCalledWith(props.tag)
    });
});
