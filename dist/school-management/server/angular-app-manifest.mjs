
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/dashboard",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/auth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-OPO3PBWO.js"
    ],
    "route": "/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-OPO3PBWO.js"
    ],
    "route": "/auth/signup"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-OPO3PBWO.js"
    ],
    "route": "/auth/forgot-password"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-OPO3PBWO.js"
    ],
    "route": "/auth/otp"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-OPO3PBWO.js"
    ],
    "route": "/auth/reset-password"
  },
  {
    "renderMode": 2,
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "route": "/student-dashboard"
  },
  {
    "renderMode": 2,
    "route": "/addstudent"
  },
  {
    "renderMode": 2,
    "route": "/class-promotion"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 29370, hash: 'ced084bd593d0a4fa1c073ab457268736d9ca2a752ab87d748bdf54b7b8b252b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17574, hash: '5c0e18d8ed8938f60c6f422419b81e4bbd0a7f9cde3c41e97f91b0c691513345', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'auth/index.html': {size: 30470, hash: '9bdbdabbbebed3f011c15597fbfbb3a95d48cabcaa0d24a9a920e58b8ee92ed2', text: () => import('./assets-chunks/auth_index_html.mjs').then(m => m.default)},
    'auth/signup/index.html': {size: 30523, hash: '297d474b159bd1d0e6473a5d019dd769032c206309200ceee7a6f644d55247e4', text: () => import('./assets-chunks/auth_signup_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 30523, hash: '297d474b159bd1d0e6473a5d019dd769032c206309200ceee7a6f644d55247e4', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'auth/forgot-password/index.html': {size: 30523, hash: '297d474b159bd1d0e6473a5d019dd769032c206309200ceee7a6f644d55247e4', text: () => import('./assets-chunks/auth_forgot-password_index_html.mjs').then(m => m.default)},
    'auth/otp/index.html': {size: 30523, hash: '297d474b159bd1d0e6473a5d019dd769032c206309200ceee7a6f644d55247e4', text: () => import('./assets-chunks/auth_otp_index_html.mjs').then(m => m.default)},
    'auth/reset-password/index.html': {size: 30523, hash: '297d474b159bd1d0e6473a5d019dd769032c206309200ceee7a6f644d55247e4', text: () => import('./assets-chunks/auth_reset-password_index_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 30470, hash: '9bdbdabbbebed3f011c15597fbfbb3a95d48cabcaa0d24a9a920e58b8ee92ed2', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'student-dashboard/index.html': {size: 30470, hash: '9bdbdabbbebed3f011c15597fbfbb3a95d48cabcaa0d24a9a920e58b8ee92ed2', text: () => import('./assets-chunks/student-dashboard_index_html.mjs').then(m => m.default)},
    'addstudent/index.html': {size: 30470, hash: '9bdbdabbbebed3f011c15597fbfbb3a95d48cabcaa0d24a9a920e58b8ee92ed2', text: () => import('./assets-chunks/addstudent_index_html.mjs').then(m => m.default)},
    'class-promotion/index.html': {size: 30470, hash: '9bdbdabbbebed3f011c15597fbfbb3a95d48cabcaa0d24a9a920e58b8ee92ed2', text: () => import('./assets-chunks/class-promotion_index_html.mjs').then(m => m.default)},
    'styles-DTJHXU5A.css': {size: 311551, hash: 'e6YvmXK1WtQ', text: () => import('./assets-chunks/styles-DTJHXU5A_css.mjs').then(m => m.default)}
  },
};
