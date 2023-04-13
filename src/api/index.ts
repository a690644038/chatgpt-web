import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post,get } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
  }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

interface RegisterData {
  username: string;
  email: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
}

export function fetchRegister<T>(data: RegisterData) {
  return post<T>({
    url: '/user/register',
    data
  })
}

interface LoginData {
  email: string;
  password: string;
}

export function fetchLogin<T = any>(data: LoginData) {
  return post<T>({
    url: '/user/login',
    data
  })
}

export function sendEmail<T>(data:any) {
  return post<T>({
    url: '/user/send-verification-code',
    data
  })
}


export function pay<T>(data:any) {
  return post<T>({
    url: '/pay/playment',
    data
  })
}


export function getMembership<T>(){
  return get<T>({
    url: '/pay/membership-level',
  })
}