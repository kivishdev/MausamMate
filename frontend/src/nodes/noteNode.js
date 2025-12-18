// noteNode.js
import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const NoteNode = ({ id, data }) => {
    const [note, setNote] = useState('Type your note here...');

    return (
        <BaseNode id={id} data={data} title="Note">
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ width: '100%', height: '50px' }}
            />
        </BaseNode>
    );
};
