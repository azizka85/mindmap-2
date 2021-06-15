import { MindMapContext, MindMapContextKey, MindMapInstance, MindNodeEntity, MindNodeInstance } from "./MindMapContext";
import { MindNode } from "./MindNode";

export class MindMap extends HTMLUListElement implements MindMapInstance {
  constructor(protected context?: MindMapContext) {
    super();

    this.className = 'mindmap';   
    
    this.onclick = this.DisposeActiveNode.bind(this);
  }

  get Id(): number | undefined {
    return undefined;
  }

  get MindNodes(): MindNodeEntity[] {
    const nodes: MindNodeEntity[] = [];

    for(let i = 0; i < this.MindNodesCount; i++) {
      const elem = this.children.item(i) as MindNode;
      const node = elem.MindNode;

      if(node) {
        nodes.push(node);
      }
    }

    return nodes;
  }

  get MindNodesCount(): number {
    return this.children.length;
  }  

  Init(context?: MindMapContext) {
    this.context = context;
    
    for(let i = 0; i < this.children.length; i++) {
      (this.children.item(i) as MindNode).Init?.(this, this.context);
    }
  }

  Update(nodes: MindNodeEntity[]) {
    this.innerHTML = '';

    nodes.forEach(node => {
      const elem = new MindNode(true, this, this.context);

      elem.MindNode = node;
      elem.Collapsed = false;
      elem.BindHandlers();

      this.appendChild(elem);
    })
  }

  DisposeActiveNode() {
    if(this.context && this.context.ToolBar) {
      this.context.ToolBar.ActiveNode = undefined;
    }
  }

  MindNodeIndex(item: MindNodeInstance): number {
    let index = -1;
    
    for(let i = 0; i < this.children.length; i++) {
      if(((this.children.item(i) as unknown) as MindNodeInstance).Id === item.Id) {
        index = i;
        break;
      }
    }

    return index;
  }

  MoveToMindNode(index: number) {
    if(this.context && this.context.ToolBar && index < this.children.length) {
      this.context.ToolBar.ActiveNode = (this.children.item(index) as unknown) as MindNodeInstance;
    }
  }  

  CreateMindNode() {
    const item = new MindNode(true, this, this.context);
    
    item.Id = Date.now();
    item.Label = '';
    item.Editable = true;
    item.BindHandlers();

    this.appendChild(item);

    if(this.context && this.context.ToolBar) {
      this.context.ToolBar.ActiveNode = item;
      this.context.ToolBar.CanSave = true;
    }
  }
  
  RemoveMindNode(item: MindNodeInstance) {
    const node = (item as unknown) as MindNode;
    const index = this.MindNodeIndex(item);
    const length = this.MindNodesCount;

    if(length < 2) return;

    node.UnBindHandlers?.();
    this.removeChild(node);

    if(this.context && this.context.ToolBar) {
      this.context.ToolBar.CanSave = true;
    }

    let focusIndex = length - 2;

    if(length > index + 1) {
      focusIndex = index;
    }

    if(focusIndex >= 0) {
      this.MoveToMindNode(focusIndex); 
    } 
  }

  SaveToLocalStorage() {
    localStorage.setItem(MindMapContextKey, JSON.stringify(this.MindNodes));
  }

  LoadFromLocalStorage() {
    let data = undefined;

    try {
      data = JSON.parse(localStorage.getItem(MindMapContextKey) || '');
    } catch(error) {
      console.error(error);
    }

    if(!data || typeof data !== 'object') {
      const nodes: MindNodeEntity[] = [{
        id: Date.now(),
        label: 'Press Space or double click to edit',
        children: []      
      }];

      data = nodes;
    }

    this.Update(data as MindNodeEntity[]);
  }
}
