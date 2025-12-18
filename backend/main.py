from fastapi import FastAPI, Form
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

class PipelineData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(data: PipelineData):
    nodes = data.nodes
    edges = data.edges
    num_nodes = len(nodes)
    num_edges = len(edges)

    # Build adjacency list
    adj_list = {node['id']: [] for node in nodes}
    for edge in edges:
        source = edge['source']
        target = edge['target']
        if source in adj_list:
            adj_list[source].append(target)

    # Check for DAG using DFS
    visited = set()
    recursion_stack = set()

    def is_cyclic(node_id):
        visited.add(node_id)
        recursion_stack.add(node_id)

        if node_id in adj_list:
            for neighbor in adj_list[node_id]:
                if neighbor not in visited:
                    if is_cyclic(neighbor):
                        return True
                elif neighbor in recursion_stack:
                    return True

        recursion_stack.remove(node_id)
        return False

    is_dag = True
    for node in nodes:
        if node['id'] not in visited:
            if is_cyclic(node['id']):
                is_dag = False
                break

    return {'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': is_dag}
