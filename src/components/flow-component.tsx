"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Handle,
  Node,
  NodeProps,
  Position,
  ReactFlowInstance,
} from "reactflow";
import createFlowData from "~/lib/createFlowData.ts";
import layoutElements from "~/lib/layoutElements.ts";
import useTreeData from "~/lib/stores/tree-data.ts";
import { cn } from "~/lib/utils.ts";

import StepEditor from "./step-editor.tsx";
import { Sheet } from "./ui/sheet.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip.tsx";

export default function FlowComponent() {
  const treeDataState = useTreeData();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [modalId, setModalId] = useState<string | undefined>(undefined);
  const layoutUpdate = useRef(false);

  useEffect(() => {
    const { nodes, edges } = createFlowData(treeDataState.data);
    setNodes(nodes);
    setEdges(edges);
    layoutUpdate.current = true;
  }, [treeDataState.data]);

  useEffect(() => {
    if (layoutUpdate.current) {
      layoutElements(nodes, edges).then(layoutedNodes => {
        setNodes(layoutedNodes);
        layoutUpdate.current = false;
      });
    }
  }, [nodes, edges]);

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    if ((nodes.length > 0 || edges.length > 0) && !layoutUpdate.current) {
      // this is stupid but whatever
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (isFirstRender) {
            const node = nodes.find(node => node.id == "index");
            if (node && reactFlowInstance.current) {
              const { x, y } = node.position;
              const { width } = reactFlowWrapper.current!.getBoundingClientRect();
              reactFlowInstance.current.setCenter(x + (isFirstRender ? width / 2 - 50 : 0), y, {
                zoom: 0.8,
                duration: 0,
              });
            }
            setIsFirstRender(false);
          }
        });
      });
    }
  }, [nodes, edges, reactFlowInstance]);

  const nodeTypes = useMemo(
    () => ({
      input: (nodeProps: NodeProps) => (
        <CustomNode
          {...nodeProps}
          onClick={() => {
            setModalId(nodeProps.id);
          }}
        />
      ),
    }),
    []
  );

  return (
    <TooltipProvider>
      <div className={"w-full h-full"} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onInit={(rfi: ReactFlowInstance) => {
            if (!reactFlowInstance.current) {
              reactFlowInstance.current = rfi;
            }
          }}
          fitView
          nodeTypes={nodeTypes}
          minZoom={0.05}
          maxZoom={1.5}
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} />
        </ReactFlow>
        <Sheet open={typeof modalId !== "undefined"} onOpenChange={() => setModalId(undefined)}>
          <StepEditor id={modalId} onClose={() => setModalId(undefined)} />
        </Sheet>
      </div>
    </TooltipProvider>
  );
}

interface CustomNodeProps {
  id: string;
  data: { error?: string; isFinal: boolean };
  onClick: () => void;
}

const CustomNode: React.FC<CustomNodeProps> = ({ id, data, onClick }) => {
  const child = (
    <button
      className={cn(
        "bg-gray-200 px-6 py-3 rounded-md overflow-hidden relative border border-gray-500 min-w-[200px] font-medium shadow-sm font-mono",
        data.error && "border-red-500 bg-red-200 text-red-500",
        id === "index" ? "bg-green-600 border-green-900 text-white shadow-lg" : "bg-opacity-70 backdrop-blur",
        data.isFinal && "bg-gray-950 text-white border-black"
      )}
      onClick={onClick}
    >
      <Handle type="target" id={"target"} position={Position.Left} isConnectable={false} />
      {id === "index" ? "INPUT" : id}
      <Handle type="source" id={"source"} position={Position.Right} isConnectable={false} />
    </button>
  );

  if (data.error) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{child}</TooltipTrigger>
        <TooltipContent side={"bottom"} className={"bg-red-500 text-white"}>
          <p>{data.error}</p>
        </TooltipContent>
      </Tooltip>
    );
  } else return child;
};
