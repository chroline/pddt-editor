import { create } from "zustand";
import Step from "~/lib/Step.ts";

import { deleteStep, saveStep } from "../actions.ts";

interface TreeDataState {
  data: Record<string, Step>;
  updateNode: (id: string, step: Step & { id: string }) => void;
  saveNode: (id: string) => Promise<void>;
  deleteNode: (id: string) => Promise<void>;
}

const useTreeData = create<TreeDataState>()((setState, getState) => ({
  data: {},
  updateNode(id, step) {
    const oldData = { ...getState().data };
    delete oldData[id];
    delete oldData[step.id];

    const newData = {
      ...oldData,
      [step.id]: step,
    } as Record<string, Step>;

    const keysToSave = [];
    if (id !== step.id) {
      getState().deleteNode(id);
      delete newData[id];

      // Update options to point to the new step id
      for (const key in newData) {
        console.log({ newData, key });
        if (newData[key].options) {
          newData[key].options = newData[key].options.map(option => ({
            ...option,
            next: option.next === id ? step.id : option.next,
          }));
        }
        keysToSave.push(key);
      }
    }

    step.options?.forEach(option => {
      if (typeof newData[option.next] == "undefined") {
        newData[option.next] = {
          prompt: "",
          variable: "",
          options: [],
        };
      }
    });

    setState({
      data: newData,
    });

    keysToSave.forEach(getState().saveNode);
  },
  async saveNode(id) {
    await saveStep(id, getState().data[id]);
  },
  async deleteNode(id) {
    const newData = {
      ...getState().data,
    };

    delete newData[id];

    setState({
      data: newData,
    });

    await deleteStep(id);
  },
}));

export default useTreeData;
