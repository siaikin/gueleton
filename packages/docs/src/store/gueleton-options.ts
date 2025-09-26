import { atom } from 'nanostores';
import type { GueletonOptions } from 'unplugin-gueleton/client/core';

export const gueletonOptions = atom<GueletonOptions<any> & { fetchDelay: number }>({
  dataKey: 'example',
  data: undefined,
  prestoreData: undefined,
  forceRender: false,
  limit: 3,
  loading: false,
  skeleton: {
    type: 'overlay',
    fuzzy: 1,
    bone: {
      style: {
        borderRadius: '8px'
      },
    },
    container: {
      className: 'animate-wave'
    },
  },
  fetchDelay: 1,
});