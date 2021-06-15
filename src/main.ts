import './styles/main.scss';
import { MindMapContext } from './components/MindMapContext';
import { ToolBar } from './components/ToolBar';
import { MindMap } from './components/MindMap';
import { MindNode } from './components/MindNode';

customElements.define('mind-map-context', MindMapContext, { extends: 'div' });
customElements.define('tool-bar', ToolBar, { extends: 'div' });
customElements.define('mind-map', MindMap, { extends: 'ul' });
customElements.define('mind-node', MindNode, { extends: 'li' });
