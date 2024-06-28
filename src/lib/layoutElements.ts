import ELK from "elkjs/lib/elk.bundled";
import { Edge, Node } from "reactflow";

const elk = new ELK({
  algorithms: ["layered"],
  defaultLayoutOptions: {
    "elk.algorithm": "layered",
    "elk.direction": "right",
    "elk.spacing.nodeNode": "20",
    "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
    "elk.layered.layering.strategy": "NETWORK_SIMPLEX",
    "elk.aspectRatio": "1.6",
    "elk.layered.layering.maxNodesPerLayer": "5", // Custom option to limit nodes per layer
    //"elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
  },
});

export default async function layoutElements(nodes: Node[], edges: Edge[]): Promise<Node[]> {
  const elkGraph = {
    id: "root",
    children: nodes.map(node => {
      return {
        id: node.id,
        width: Math.max(node.id.length * 10 + 50, 250),
        //width: 200,
        height: 70,
        labels: [{ text: node.data.label }],
      };
    }),
    edges: edges.map(edge => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layout = await elk.layout(elkGraph);

  return nodes.map(node => {
    const elkNode = layout.children!.find(n => n.id === node.id)!;
    return {
      ...node,
      position: {
        x: elkNode.x! - elkNode.width! / 2,
        y: elkNode.y! - elkNode.height! / 2,
      },
    };
  });
}
