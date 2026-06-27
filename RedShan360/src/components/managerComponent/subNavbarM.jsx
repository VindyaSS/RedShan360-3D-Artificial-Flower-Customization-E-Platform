import React, { useState, useEffect } from 'react';
import '../../css/manager.css';
import { ChevronDown } from 'lucide-react';

export default function SubNavbarM({ activeSector = 'All', onSectorChange }) {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const sectors = ['All', 'Anniversary', 'Birthday', 'Convocation'];
    
    const dropdownOptions = {
        All: ['Boquets', 'Individual Flowers', 'Head Dresses'],
        Anniversary: ['Boquets', 'Individual Flowers'],
        Birthday: ['Boquets', 'Individual Flowers', 'Head Dresses'],
        Convocation: ['Boquets', 'Individual Flowers']
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (!event.target.closest('.dropdown-container')) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSectorClick = (sector) => {
        if (dropdownOptions[sector]) {
            setActiveDropdown(activeDropdown === sector ? null : sector);
        } else {
            setActiveDropdown(null);
            if (onSectorChange) {
                onSectorChange(sector);
            }
        }
    };

    const handleDropdownOptionClick = (sector, option) => {
        setActiveDropdown(null);
        if (onSectorChange) {
            onSectorChange(`${sector} - ${option}`);
        }
    };

    return (
        <nav className="sub-navbar" style={{ overflow: 'visible' }}>
            {sectors.map((sector) => {
                const options = dropdownOptions[sector];
                const isDropdown = !!options;
                const isSelected = activeSector.startsWith(sector);

                if (isDropdown) {
                    return (
                        <div key={sector} className="dropdown-container" style={{ position: 'relative' }}>
                            <button
                                className={`sub-navbar-btn flex items-center justify-center gap-1 ${isSelected ? 'active' : ''}`}
                                onClick={() => handleSectorClick(sector)}
                            >
                                <span>{sector}</span>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === sector ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {activeDropdown === sector && (
                                <div className="dropdown-menu">
                                    {options.map((option) => {
                                        const optionValue = `${sector} - ${option}`;
                                        const isActive = activeSector === optionValue;
                                        return (
                                            <button
                                                key={option}
                                                className={`dropdown-item ${isActive ? 'active' : ''}`}
                                                onClick={() => handleDropdownOptionClick(sector, option)}
                                            >
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                }

                return (
                    <button
                        key={sector}
                        className={`sub-navbar-btn ${activeSector === sector ? 'active' : ''}`}
                        onClick={() => handleSectorClick(sector)}
                    >
                        {sector}
                    </button>
                );
            })}
        </nav>
    );
}
