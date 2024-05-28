import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  MarkerType,
} from "reactflow";
import { Container, Select, MenuItem } from "@mui/material";
import dagre from "dagre";
import "reactflow/dist/style.css";
import "./index.css";
import courses from "../sample.json";
import DownloadButton from "./components/downloadbutton";
import focusareas from "../focusareas.json";
import Sidebar from "./components/sidebar";
const courseNodes = courses.map((course) => {
  return {
    id: course.name,
    position: { x: 0, y: 0 }, // Position will be updated by layout
    data: { label: course.name },
    parentId: course.parent, // Ensure parentId is set correctly
  };
});

courseNodes.push(
  ...focusareas.map((focusarea) => {
    return {
      id: focusarea.id,
      position: { x: 0, y: 0 }, // Position will be updated by layout
      data: { label: focusarea.name },
      style: {
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        width: 200,
        height: 200,
        zIndex: 1,
      }, // Ensure group has lower z-index
      type: "group",
    };
  })
);
const createdEdges = new Set();

const initialEdges = courses.flatMap((course) => [
  ...course.prerequisites.map((prerequisite) => ({
    id: `e${course.id}-${prerequisite}`,
    source: prerequisite.toString(),
    target: course.name.toString(),
    markerEnd: {
      type: MarkerType.Arrow,
      color: "#ff0072",
    },
    style: {
      strokeWidth: 1,
      stroke: "#FF0072",
    },
  })),
  ...course.corequisites.flatMap((corequisite) => {
    const edgeId = `e${Math.min(course.id, corequisite)}-${Math.max(
      course.id,
      corequisite
    )}`;
    if (createdEdges.has(edgeId)) {
      return [];
    }
    createdEdges.add(edgeId);
    return [
      {
        id: edgeId,
        source: corequisite.toString(),
        target: course.name.toString(),
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff0072",
        },
        markerStart: {
          type: MarkerType.ArrowClosed,
          orient: "auto-start-reverse",
          color: "#ff0072",
        },
        label: "must be taken with",
        style: {
          strokeWidth: 1,
          stroke: "#FF0072",
        },
      },
    ];
  }),
]);

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

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(courseNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

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
    <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      <Sidebar/>
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
          <Background gap={25} />
          <DownloadButton />
        </ReactFlow>
      </div>
    </div>
  );
}


export default App