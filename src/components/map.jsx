import { useCallback, useEffect, useContext } from "react";
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

  const parsePrereqTree = (prereqTree, courseId, nodesData, edges = []) => {

  if (typeof prereqTree === "string") {
    const validprereqTree = prereqTree.replace(/'/g, '"');
    const parsedTree = JSON.parse(validprereqTree);
    return parsePrereqTree(parsedTree, courseId, nodesData, edges);
  }
  //iterate through json
  console.log("prereqTree: ", prereqTree);
  for (const key in prereqTree) {
    console.log("key: ", key);
    
    if (key == "nOf") {
      continue;
      let length = prereqTree[key][0];

      for (let i = 0; i < length; i++) {
        // if prereqTree[key][1][i] is nested, call parsePrereqTree again
        if (typeof prereqTree[key][1][i] === "object") {
          edges = parsePrereqTree(prereqTree[key][1][i], courseId, nodesData, edges);
          continue;
        }
        console.log("prereqTree[key][i]: ", prereqTree[key][1][i]);
        // if code is CS1231:C split it into CS1231 and keep C as another variable
        let code = prereqTree[key][1][i].split(":")[0];
        let grade = prereqTree[key][1][i].split(":")[1];

        console.log("code: ", code);
        console.log("courseId: ", courseId);

        // if code not in nodesData, add it
        if (!nodesData.find((node) => node.id === code)) {
          let node = {
            id: code,
            data: { label: code },
            position: { x: 0, y: 0 },
            type: "",
          };
          nodesData.push(node);
        }
        let edge = {
          id: `${courseId}-${prereqTree[key][1][i]}`,
          source: code,
          target: courseId,
        };

        edges.push(edge);
      }
    }

    if (key == "and" || key == "or") {
     console.log("prereqTree[key]: ", prereqTree[key]);

     for (let i = 0; i < prereqTree[key].length; i++) {
        console.log("prereqTree[key][i]: ", prereqTree[key][i]);

        if (typeof prereqTree[key][i] === "object") {
          edges = parsePrereqTree(prereqTree[key][i], courseId, nodesData, edges);
          continue;
        }

        let code = prereqTree[key][i].split(":")[0];
        let grade = prereqTree[key][1][i].split(":")[1];

        if (!nodesData.find((node) => node.id === code)) {
          let node = {
            id: code,
            data: { label: code },
            position: { x: 0, y: 0 },
            type: "",
          };
          nodesData.push(node);
        }
        let edge = {
          id: `${courseId}-${prereqTree[key][1][i]}`,
          source: code,
          target: courseId,
        };

        edges.push(edge);
      


        
      }
    }

    


  }
  return edges;
};


  const onLayout = useCallback(
    ({ direction }) => {
      const opts = { "elk.direction": direction, ...elkOptions };
      const nodesData = courses.map((course) => ({
        id: course.modulecode,
        data: { label: course.modulecode },
        position: { x: 0, y: 0 },
        type: course.prereqtree ? "" : "output",
      }));

      // Assuming you have a logic to generate edges, otherwise it's empty.
      const edgesData = courses.flatMap((course) =>
        course.prereqtree ? parsePrereqTree(course.prereqtree, course.modulecode, nodesData) : []
    );
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
    <Container style={{width:"100vw", height:"100vh"}}>
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
