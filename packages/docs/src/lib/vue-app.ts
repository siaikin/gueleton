import type { App } from 'vue';
import GueletonPlugin from 'unplugin-gueleton/client/vue';

export default (app: App) => {
  app.use(GueletonPlugin);
};