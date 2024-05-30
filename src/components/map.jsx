import React, { useCallback, useEffect, useContext } from "react";
import { Container } from "@mui/material";
import { coursesContext } from "../context";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import ELK from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      width: 150,
      height: 50,
    })),
    edges: edges.map((edge) => ({ ...edge })),
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        position: { x: node.x, y: node.y },
      })),
      edges: layoutedGraph.edges.map((edge) => ({ ...edge })),
    }))
    .catch(console.error);
};

const Map = () => {
  const { courses } = useContext(coursesContext);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onLayout = useCallback(
    ({ direction }) => {
      const opts = { "elk.direction": direction, ...elkOptions };
      const nodesData = courses.map((course) => ({
        id: course.modulecode,
        data: { label: course.modulecode },
        position: { x: 0, y: 0 },
      }));
      const edgesData = []; // Define edges if available, for now it's empty

      getLayoutedElements(nodesData, edgesData, opts).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
          fitView();
        }
      );
    },
    [courses, setNodes, setEdges, fitView]
  );

  useEffect(() => {
    if (courses && courses.length > 0) {
      onLayout({ direction: "DOWN" });
    }
  }, [courses, onLayout]);

  function MiniMapNode({ x, y }) {
    return <circle cx={x} cy={y} r="50" />;
  }

  function nodeColor(node) {
    switch (node.type) {
      case "input":
        return "#6ede87";
      case "output":
        return "#6865A5";
      default:
        return "#ff0072";
    }
  }

  if (!courses || courses.length === 0) {
    return <Container maxWidth="sm">No courses available</Container>;
  }

  return (
    <Container maxWidth="sm">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <MiniMap
          nodeColor={nodeColor}
          nodeComponent={MiniMapNode}
          pannable
          zoomable
          nodeStrokeWidth={3}
        />
      </ReactFlow>
    </Container>
  );
};

const WrappedMap = () => (
  <ReactFlowProvider>
    <Map />
  </ReactFlowProvider>
);

export default WrappedMap;
