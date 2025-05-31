import React from "react";

// Only include morphotypes present in DB
const morphotypesOptions = [
    { value: "Alnus", label: "Alnus" },
    { value: "Artemisia", label: "Artemisia" },
    { value: "Ambrosia", label: "Ambrosia" },
    { value: "Corylus", label: "Corylus" },
    { value: "Betula", label: "Betula" },
    { value: "Quercus", label: "Quercus" },
    { value: "Pinus", label: "Pinus" },
    { value: "Poaceae", label: "Poaceae" },
    { value: "Salix", label: "Salix" },
    { value: "Populus", label: "Populus" },
    { value: "Acer", label: "Acer" }
];

const MorphotypesSelector = ({ selectedParams, setSelectedParams }) => {
    const handleCheckboxChange = (type) => {
        setSelectedParams((prev) =>
            prev.includes(type)
                ? prev.filter((p) => p !== type)
                : [...prev, type]
        );
    };

    return (
        <div className="checkbox-list">
            {morphotypesOptions.map((type) => (
                <label key={type.value} className="checkbox-label">
                    <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedParams.includes(type.value)}
                        onChange={() => handleCheckboxChange(type.value)}
                    />
                    {type.label}
                </label>
            ))}
        </div>
    );
};

export default MorphotypesSelector;