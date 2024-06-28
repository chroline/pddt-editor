import { create } from "zustand";
import { saveHeadPrompt } from "~/lib/actions.ts";

interface HeadPromptState {
  content: string;
  update: (content: string) => void;
  save: () => Promise<void>;
}

const useHeadPrompt = create<HeadPromptState>()((setState, getState) => ({
  content: "",
  update(content) {
    setState({ content });
  },
  async save() {
    await saveHeadPrompt(getState().content);
  },
}));

export default useHeadPrompt;
