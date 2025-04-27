import React from 'react';

const graphTypes = [
    { value: "line", label: "Line graph" },
    { value: "bar", label: "Bar chart" },
    { value: "scatter", label: "Scatter plot" },
];

const GraphTypeSelector = ({ selectedGraph, setSelectedGraph }) => {
    return (
        <div className="block-1">
            {graphTypes.map((graph) => (
                <label key={graph.value} className="radio-label">
                    <input
                        type="radio"
                        name="graphType"
                        value={graph.value}
                        checked={selectedGraph === graph.value}
                        onChange={(e) => setSelectedGraph(e.target.value)}
                        className="radio-input"
                    />
                    {graph.label}
                </label>
            ))}
        </div>
    );
};

export default GraphTypeSelector;
