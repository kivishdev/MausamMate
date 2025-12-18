from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Ping": "Pong"}

def test_parse_pipeline_dag():
    data = {
        "nodes": [{"id": "1"}, {"id": "2"}, {"id": "3"}],
        "edges": [{"source": "1", "target": "2"}, {"source": "2", "target": "3"}]
    }
    response = client.post("/pipelines/parse", json=data)
    assert response.status_code == 200
    result = response.json()
    assert result["num_nodes"] == 3
    assert result["num_edges"] == 2
    assert result["is_dag"] == True

def test_parse_pipeline_cycle():
    data = {
        "nodes": [{"id": "1"}, {"id": "2"}],
        "edges": [{"source": "1", "target": "2"}, {"source": "2", "target": "1"}]
    }
    response = client.post("/pipelines/parse", json=data)
    assert response.status_code == 200
    result = response.json()
    assert result["num_nodes"] == 2
    assert result["num_edges"] == 2
    assert result["is_dag"] == False

def test_parse_pipeline_empty():
    data = {
        "nodes": [],
        "edges": []
    }
    response = client.post("/pipelines/parse", json=data)
    assert response.status_code == 200
    result = response.json()
    assert result["num_nodes"] == 0
    assert result["num_edges"] == 0
    assert result["is_dag"] == True
