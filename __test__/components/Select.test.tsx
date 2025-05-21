import { render, screen, fireEvent } from '@testing-library/react';
import Select from '@/components/Select';

describe('Select component', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];
  const onChangeMock = jest.fn();

  beforeEach(() => {
    onChangeMock.mockClear();
  });

  it('renders without crashing and shows placeholder', () => {
    render(<Select options={options} onChange={onChangeMock} />);
    expect(screen.getByText('Sélectionner...')).toBeInTheDocument();
  });

  it('opens dropdown on click and shows options', () => {
    render(<Select options={options} onChange={onChangeMock} />);
    fireEvent.click(screen.getByText('Sélectionner...'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('selects an option and calls onChange', () => {
    render(<Select options={options} onChange={onChangeMock} />);
    fireEvent.click(screen.getByText('Sélectionner...'));
    fireEvent.click(screen.getByText('Option 2'));
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument(); // dropdown closed
    expect(screen.getByText('Option 2')).toBeInTheDocument(); // selected option shown
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: '2' }),
      })
    );
  });

  it('filters options when searchable', () => {
    render(<Select options={options} searchable onChange={onChangeMock} />);
    fireEvent.click(screen.getByText('Sélectionner...'));

    const searchInput = screen.getByPlaceholderText('Rechercher...');
    fireEvent.change(searchInput, { target: { value: '1' } });

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });

  it('shows "Aucun résultat" when no options match filter', () => {
    render(<Select options={options} searchable onChange={onChangeMock} />);
    fireEvent.click(screen.getByText('Sélectionner...'));

    const searchInput = screen.getByPlaceholderText('Rechercher...');
    fireEvent.change(searchInput, { target: { value: 'zzz' } });

    expect(screen.getByText('Aucun résultat')).toBeInTheDocument();
  });
});
