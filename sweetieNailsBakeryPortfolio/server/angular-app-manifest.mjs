
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 11885, hash: 'b0c33995d965c54d836ce6ad618dbf0cdddd050540c8c222c168cae76c5464b0', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1008, hash: '45a8b8ae4e1ded8c86ac89c19f1a6be8238b5fecbcf6e6d3877c31f3a2302157', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 68390, hash: 'd43d3951161aec19796f2f40b45dbd1c0b6e2151b0c5ac29349f993a95fb1e42', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-OUPP6OJ6.css': {size: 14129, hash: 'ijvwi+fNpf8', text: () => import('./assets-chunks/styles-OUPP6OJ6_css.mjs').then(m => m.default)}
  },
};
