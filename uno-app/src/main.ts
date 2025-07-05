import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import 'vue3-toastify/dist/index.css';
import { createPinia } from 'pinia';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCrown, faGear, faRemove, faUser } from '@fortawesome/free-solid-svg-icons';
import { updateGlobalOptions } from 'vue3-toastify';

library.add(faUser, faCrown, faGear, faRemove);

const app = createApp(App);

app.use(createPinia());
app.component('font-awesome-icon', FontAwesomeIcon);
updateGlobalOptions({
  autoClose: 3000,
  theme: 'auto',
  toastClassName: 'toast',
  pauseOnFocusLoss: false
})

app.mount('#app');
