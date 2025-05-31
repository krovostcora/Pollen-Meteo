import React from 'react';
import { useTranslation } from 'react-i18next';

const GraphTypeSelector = ({ selectedGraph, setSelectedGraph }) => {
    const { t } = useTranslation();

    const graphTypes = [
        { value: "line", label: t('lineGraph') },
        { value: "bar", label: t('barChart') },
    ];

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
