// BaseNode.js
import { Handle, Position } from 'reactflow';
import '../index.css'; // Import styles

export const BaseNode = ({ id, data, title, children, handles = [], style = {} }) => {
  return (
    <div className="custom-node" style={{...style}}>
      {/* Handles */}
      {handles.map((handle, index) => (
        <Handle
          key={`${id}-${handle.id}-${index}`}
          type={handle.type}
          position={handle.position}
          id={`${id}-${handle.id}`}
          style={handle.style}
        />
      ))}

      {/* Node Header */}
      <div className="node-header">
        <span>{title}</span>
      </div>

      {/* Node Content */}
      <div className="node-content">
        {children}
      </div>
    </div>
  );
};
