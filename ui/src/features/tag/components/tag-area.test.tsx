import { render, screen, fireEvent } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { Provider } from 'react-redux';
import TagChip from './tag-chip';

const mockStore = configureMockStore([thunk]);

describe('TagChip', () => {
    let store: any = mockStore({ });

    let props: {
        tag: string;
        showDelete: boolean;
        handleOnDeleteClick: jest.Mock;
    };

    beforeEach(() => {
        store = mockStore({});

        props = {
          tag: 'Test tag 1',
          showDelete: true,
          handleOnDeleteClick: jest.fn(),
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });


    it('renders correctly', () => {
        render(
            <Provider store={ store }>
                <TagChip {...props } />
            </Provider>
        );

        const tagElement = screen.getByText(props.tag);

        expect(tagElement).toBeInTheDocument();
    });

    it('close button should not render when showDelete is false"', () => {
        render(
            <Provider store={ store }>
                <TagChip { ...props } showDelete={ false } />
            </Provider>
        );

        const closeButton = screen.queryByRole('button', { name: '' });

        expect(closeButton).not.toBeInTheDocument();
    });

    it('clicking close button should call onDeleteClick', () => {
        render(
            <Provider store={ store }>
                <TagChip { ...props } />
            </Provider>
        );

        const closeButton = screen.getByRole('button', { name: '' });

        fireEvent.click(closeButton);

        expect(props.handleOnDeleteClick).toHaveBeenCalledWith(expect.anything(), props.tag)
    });
});
