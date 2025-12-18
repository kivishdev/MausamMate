// sliderNode.js
import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const SliderNode = ({ id, data }) => {
    const [value, setValue] = useState(50);

    return (
        <BaseNode id={id} data={data} title="Slider">
            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <span>{value}</span>
        </BaseNode>
    );
};
