import { Edge, MarkerType, Node } from "reactflow";
import Step from "~/lib/Step.ts";

export default function createFlowData(data: any) {
  const nodes: Node[] = Object.keys(data).map(id => {
    let error = undefined;

    if (data[id].prompt?.length == 0) {
      error = "Step is missing prompt.";
    } else if (!data[id]!.final && data[id]!.options?.length == 0) {
      error = "Step is missing options.";
    }

    return {
      id,
      type: "input",
      data: { error, isFinal: data[id].final ?? false },
      position: { x: 0, y: 0 },
    };
  });

  const edges: Edge[] = [];
  Object.entries(data).forEach(([key, value], i) => {
    const connections = new Set();
    (value as Step).options.forEach((option: any) => {
      if (connections.has(option.next)) return;
      connections.add(option.next);

      if (typeof data[option.next] == "undefined") {
        nodes[i].data.error = `No node found for ID: ${option.next}`;
        return;
      }

      edges.push({
        id: `e${key}-${option.next}`,
        source: key,
        target: option.next,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#6b7280",
        },
      });
    });
  });

  return { nodes, edges };
}
