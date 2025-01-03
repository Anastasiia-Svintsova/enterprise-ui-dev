import { render as _render, screen, waitFor } from 'test/utilities';
import { PackingList } from '.';
import { createStore } from './store';
import { Provider } from 'react-redux';

const render = () => {
  return _render(
    <Provider store={createStore()}>
      <PackingList />
    </Provider>,
  );
};

const setup = () => {
  const utils = render();
  const newItemInput = screen.getByLabelText('New Item Name');
  const addNewItemButton = screen.getByRole('button', { name: 'Add New Item' });

  return {
    ...utils,
    newItemInput,
    addNewItemButton,
  };
};

it('renders the Packing List application', () => {
  render();
});

it('has the correct title', async () => {
  render();
  screen.getByText('Packing List');
});

it('has an input field for a new item', () => {
  render();
  screen.getByLabelText('New Item Name');
});

it('has a "Add New Item" button that is disabled when the input is empty', () => {
  const { newItemInput, addNewItemButton } = setup();

  expect(newItemInput).toHaveValue('');
  expect(addNewItemButton).toBeDisabled();
});

it('enables the "Add New Item" button when there is text in the input field', async () => {
  const { newItemInput, addNewItemButton, user } = setup();

  const textToType = 'MacBook Pro';

  await user.type(newItemInput, textToType);

  expect(newItemInput).toHaveValue(textToType);
  expect(addNewItemButton).toBeEnabled();
});

it('adds a new item to the unpacked item list when the clicking "Add New Item"', async () => {
  const { newItemInput, addNewItemButton, user } = setup();

  const itemToAdd = 'MacBook Pro';

  await user.type(newItemInput, itemToAdd);
  await user.click(addNewItemButton);

  expect(screen.getByLabelText(itemToAdd)).not.toBeChecked();
});

it('Remove an item', async () => {
  const { newItemInput, addNewItemButton, user } = setup();

  const itemToAdd = 'MacBook Pro';

  await user.type(newItemInput, itemToAdd);
  await user.click(addNewItemButton);

  const removeItem = screen.getByLabelText(/remove/i);

  await user.click(removeItem);
  await waitFor(() => expect(removeItem).not.toBeInTheDocument());
});
