import { create } from "zustand";
import { saveResource } from "~/lib/actions.ts";

interface ResourcesState {
  data: Record<string, string>;
  updateResource: (id: string, content: string) => void;
  saveResource: (id: string) => Promise<void>;
}

const useResources = create<ResourcesState>()((setState, getState) => ({
  data: {},
  updateResource(id, content) {
    const newData = {
      ...getState().data,
      [id]: content,
    };

    setState({
      data: newData,
    });
  },
  async saveResource(id) {
    await saveResource(id, getState().data[id]);
  },
}));

export default useResources;
