'use client';

import { SelectHTMLAttributes, useState, useEffect, useRef } from 'react';
import { IoSearch } from 'react-icons/io5';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  searchable?: boolean;
}

export default function Select({ label, error, options, searchable = false, className = '', value, onChange, ...props }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(
    value ? options.find(opt => opt.value === value) || null : null
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: { value: string; label: string }) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSearchTerm('');
    // Trigger the onChange event
    const event = {
      target: { name: props.name, value: option.value }
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange?.(event);
  };

  return (
    <div className="w-full" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
        >
          {selectedOption ? selectedOption.label : 'Sélectionner...'}
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <IoSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">Aucun résultat</div>
              )}
            </div>
          </div>
        )}
      </div>
      <input
        type="hidden"
        name={props.name}
        value={selectedOption?.value || ''}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 