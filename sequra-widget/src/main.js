import { defineCustomElement } from 'vue';
import SequraWidget from './components/SequraWidget.ce.vue';

const sequraWidgetComponent = defineCustomElement(SequraWidget);

customElements.define('sequra-widget', sequraWidgetComponent);
