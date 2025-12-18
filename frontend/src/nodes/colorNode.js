// colorNode.js
import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const ColorNode = ({ id, data }) => {
    const [color, setColor] = useState('#ff0000');

    return (
        <BaseNode id={id} data={data} title="Color">
            <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
            />
        </BaseNode>
    );
};
