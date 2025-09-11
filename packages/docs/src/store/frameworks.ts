import { atom } from 'nanostores';
import type { BoundlerKey, FrameworkKey } from '../content.config';
import type { Framework } from '../lib/frameworks';
import { frameworks, defaultFramework, getFramework } from '../lib/frameworks';

// 当前显示的框架
export const displayedFramework = atom<FrameworkKey>(defaultFramework);

// URL 参数中的框架
export const queryParamFramework = atom<FrameworkKey | undefined>();

// 当前页面可用的框架列表
export const availableFrameworks = atom<Framework[]>(frameworks);

// 设置显示的框架，同时更新 localStorage 和 URL
export function setDisplayedFramework(framework: FrameworkKey) {
  displayedFramework.set(framework);
  
  // 保存到 localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('gueleton-framework', framework);
  }
  
  // 更新 URL 参数
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    url.searchParams.set('framework', framework);
    window.history.replaceState({}, '', url.toString());
  }
}

// 从 localStorage 或 URL 参数初始化框架选择
export function initializeFramework() {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  const urlFramework = url.searchParams.get('framework') as FrameworkKey;
  const savedFramework = localStorage.getItem('gueleton-framework') as FrameworkKey;
  
  const framework = urlFramework || savedFramework || defaultFramework;
  
  queryParamFramework.set(urlFramework);
  displayedFramework.set(framework);
}

/* 打包工具相关状态和函数 */

export const displayedBoundler = atom<BoundlerKey>(getFramework(defaultFramework).boundlers[0]);

export const queryParamBoundler = atom<BoundlerKey | undefined>();

// 设置显示的打包工具，同时更新 localStorage 和 URL
export function setDisplayedBoundler(boundler: BoundlerKey) {
  displayedBoundler.set(boundler);
  
  // 保存到 localStorage
  if (typeof localStorage !== 'undefined') {
    if (boundler) {
      localStorage.setItem('gueleton-boundler', boundler);
    } else {
      localStorage.removeItem('gueleton-boundler');
    }
  }
  
  // 更新 URL 参数
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    url.searchParams.set('boundler', boundler);
    window.history.replaceState({}, '', url.toString());
  }
}

// 从 localStorage 或 URL 参数初始化打包工具选择
export function initializeBoundler() {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  const urlBoundler = url.searchParams.get('boundler') as BoundlerKey;
  const savedBoundler = localStorage.getItem('gueleton-boundler') as BoundlerKey;
  
  const boundler = urlBoundler || savedBoundler || undefined;
  
  queryParamBoundler.set(urlBoundler);
  displayedBoundler.set(boundler);
}
