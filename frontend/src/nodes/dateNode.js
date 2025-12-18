// dateNode.js
import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const DateNode = ({ id, data }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    return (
        <BaseNode id={id} data={data} title="Date">
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
        </BaseNode>
    );
};
