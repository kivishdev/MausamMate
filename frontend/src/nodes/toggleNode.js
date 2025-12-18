// toggleNode.js
import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const ToggleNode = ({ id, data }) => {
    const [enabled, setEnabled] = useState(false);

    return (
        <BaseNode id={id} data={data} title="Toggle">
            <label>
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                />
                {enabled ? 'On' : 'Off'}
            </label>
        </BaseNode>
    );
};
