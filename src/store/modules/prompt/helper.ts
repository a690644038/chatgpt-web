import { ss } from '@/utils/storage'
// import json from '@/assets/JSON/prompts.json'
const LOCAL_NAME = 'promptStore'
// console.log(json,'xcxcxc');

export type PromptList = []

export interface PromptStore {
  promptList: PromptList
}

// export function defaultSetting(): PromptStore {
//   return {
//     promptList:json
//   }
// }



export function getLocalPromptList(): PromptStore {
  const promptStore: PromptStore | undefined = ss.get(LOCAL_NAME)
  return promptStore ?? { promptList: [] }
  // console.log({ ...defaultSetting(), ...promptStore });
  // return { ...defaultSetting(), ...promptStore }
}

export function setLocalPromptList(promptStore: PromptStore): void {
  ss.set(LOCAL_NAME, promptStore)
}
