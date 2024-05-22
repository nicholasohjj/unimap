import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  MarkerType
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import "../styles.css";

import courses from "../sample.json";

const courseNodes = courses.map((course) => {
  return {
    id: course.id.toString(),
    position: { x: 0, y: 0 }, // Position will be updated by layout
    data: { label: course.name },
  };
});

const initialEdges = courses.flatMap((course) => 
  course.prerequisites.map((prerequisite) => ({
    id: `e${course.id}-${prerequisite}`,
    source: prerequisite.toString(),
    target: course.id.toString(),
    markerEnd: {
      type: MarkerType.Arrow,
      color: "#ff0072"
    },
    style: {
      strokeWidth: 1,
      stroke: '#FF0072',
    },
  }))
);

const nodeWidth = 150;
const nodeHeight = 50;

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    return node;
  });

  return { nodes: layoutedNodes, edges };
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(courseNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      courseNodes,
      initialEdges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeColor = (node) => {
    switch (node.type) {
      case "input":
        return "#6ede87";
      case "output":
        return "#6865A5";
      default:
        return "#ff0072";
    }
  };

  return (
    <ReactFlowProvider>
      <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          TEST TEST
        </div>
        <div style={{ flex: 2, border: "2px solid coral" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <MiniMap
              nodeColor={nodeColor}
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
