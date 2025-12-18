// textNode.js

import { useState, useRef, useEffect } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [handles, setHandles] = useState([]);
  const textareaRef = useRef(null);

  // Function to extract variables from text
  const extractVariables = (text) => {
    const regex = /{{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  };

  // Update handles based on text content
  useEffect(() => {
    const variables = extractVariables(currText);
    const uniqueVariables = [...new Set(variables)];

    const newHandles = [
      ...uniqueVariables.map((variable, index) => ({
        type: 'target',
        position: Position.Left,
        id: variable,
        style: { top: `${(index + 1) * 20}px` } // Simple positioning, could be improved
      })),
      { type: 'source', position: Position.Right, id: 'output' }
    ];

    setHandles(newHandles);
  }, [currText]);

  // Resize textarea logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currText]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  return (
    <BaseNode id={id} data={data} title="Text" handles={handles}>
      <div>
        <label>
          Text:
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleTextChange}
            style={{
              width: '100%',
              minHeight: '40px',
              resize: 'none',
              overflow: 'hidden'
            }}
          />
        </label>
      </div>
    </BaseNode>
  );
}
