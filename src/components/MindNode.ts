import { MindMapContext, MindNodeBase, MindNodeEntity, MindNodeInstance } from "./MindMapContext";

export class MindNode extends HTMLLIElement implements MindNodeInstance {
  protected article: HTMLElement;
  protected ul: HTMLElement;

  protected childrenCollapsed: boolean;

  constructor(
    init = false,
    protected parentMindNode?: MindNodeBase, 
    protected context?: MindMapContext
  ) {
    super();       
    
    if(init) {
      this.article = document.createElement('article');
      this.appendChild(this.article);

      this.article.tabIndex = 1;

      this.ul = document.createElement('ul');      
      this.appendChild(this.ul);

      this.ListVisible = false;
    }

    this.childrenCollapsed = false;
  }  

  get Id(): number {
    return +this.id;
  }

  set Id(value: number) {
    this.id = '' + value;
  }

  get Label(): string {
    return this.article.textContent;
  }

  set Label(value: string) {
    this.article.textContent = value;
  }

  protected set ListVisible(value: boolean) {
    this.ul.style.display = value ? '' : 'none';  
  }

  get MindNode(): MindNodeEntity {
    const node: MindNodeEntity = {
      id: this.Id,
      label: this.Label,
      children: this.MindNodes
    };

    return node;
  }

  set MindNode(node: MindNodeEntity) {
    this.Id = node.id;
    this.Label = node.label;

    this.Update(node.children);
  }

  get MindNodes(): MindNodeEntity[] {
    const nodes: MindNodeEntity[] = [];

    for(let i = 0; i < this.MindNodesCount; i++) {
      const elem = this.ul.children.item(i) as MindNode;
      const node = elem.MindNode;

      if(node) {
        nodes.push(node);
      }
    }

    return nodes;
  }

  get MindNodesCount(): number {
    return this.ul.children.length;
  }

  get Active(): boolean {
    return this.article.classList.contains('active');
  }

  set Active(value: boolean) {
    if(value) {
      this.article.classList.add('active');
      this.article.focus();
    } else {
      this.article.classList.remove('active');
      this.article.blur();
    }
  }

  get Collapsed(): boolean {
    return this.article.classList.contains('collapsed');
  }

  set Collapsed(value: boolean) {
    if(value) {
      this.article.classList.add('collapsed');
    } else {
      this.article.classList.remove('collapsed');
    }
    this.ListVisible = this.MindNodesCount > 0 && !value;
  }

  get Editable() {
    return this.article.classList.contains('editable');
  }

  set Editable(value) {
    this.article.contentEditable = value ? 'true' : 'false';

    if(value) {
      this.article.classList.add('editable');
    } else {
      this.article.classList.remove('editable');
    }   
  }

  get CanMoveToLeftNode(): boolean {
    return this.parentMindNode?.Id !== undefined;
  }

  get CanMoveToUpNode(): boolean {
    const index = this.parentMindNode?.MindNodeIndex?.(this) || 0;

    return index > 0;
  }

  get CanMoveToDownNode(): boolean {
    const index = this.parentMindNode?.MindNodeIndex?.(this) || 0;
    const length = this.parentMindNode?.MindNodesCount || 0;
    
    return index >= 0 && index < length - 1;
  }

  get CanMoveToRightNode(): boolean {
    return !this.Collapsed && this.MindNodesCount > 0;
  }

  Init(parentMindNode?: MindNodeBase, context?: MindMapContext) {
    this.parentMindNode = parentMindNode;
    this.context = context;

    if(this.children.length > 0) {
      this.article = this.children.item(0) as HTMLElement;
    } else {
      this.article = document.createElement('article');
      this.appendChild(this.article);    
    }

    this.article.tabIndex = 1;

    if(this.children.length > 1) {
      this.ul = this.children.item(1) as HTMLElement;
    } else {
      this.ul = document.createElement('ul');      
      this.appendChild(this.ul);
    }

    this.BindHandlers();

    if(this.MindNodesCount > 0) {
      for(let i = 0; i < this.MindNodesCount; i++) {
        (this.ul.children.item(i) as MindNode).Init?.(this, this.context);
      }
    } else {
      this.ListVisible = false;
    } 
  }

  Update(nodes: MindNodeEntity[]) {
    this.ul.innerHTML = '';

    nodes.forEach(node => {
      const elem = new MindNode(true, this, this.context);

      elem.MindNode = node;
      elem.Collapsed = false;
      elem.BindHandlers();

      this.ul.appendChild(elem);
    })
  }

  BindHandlers() {
    this.article.onclick = this.OnNodeClicked.bind(this);
    this.article.onkeydown = this.OnNodeKeyPressed.bind(this);
  }

  UnBindHandlers() {
    this.article.onclick = null;
    this.article.onkeydown = null;
  }

  UpdateMindNodesCollapsed(collapsed: boolean) {
    this.Collapsed = false;

    for(let i = 0; i < this.MindNodesCount; i++) {
      (this.ul.children.item(i) as MindNode).Collapsed = collapsed;
    }
  }

  MindNodeIndex(item: MindNodeInstance): number {
    let index = -1;

    for(let i = 0; i < this.ul.children.length; i++) {
      if(((this.ul.children.item(i) as unknown) as MindNodeInstance).Id === item.Id) {
        index = i;
        break;
      }
    }

    return index;
  }

  MoveToMindNode(index: number) {
    if(this.context && this.context.ToolBar && index < this.MindNodesCount) {
      this.context.ToolBar.ActiveNode = (this.ul.children.item(index) as unknown) as MindNodeInstance;
    }
  }

  MoveToLeftNode() {
    if(this.context && this.context.ToolBar && this.CanMoveToLeftNode) {
      this.context.ToolBar.ActiveNode = this.parentMindNode as MindNodeInstance;
    }
  }

  MoveToUpNode() {
    if(this.CanMoveToUpNode) {
      const index = this.parentMindNode.MindNodeIndex(this);
      
      this.parentMindNode.MoveToMindNode(index - 1);
    }
  }

  MoveToDownNode() {
    if(this.CanMoveToDownNode) {
      const index = this.parentMindNode.MindNodeIndex(this);
      
      this.parentMindNode.MoveToMindNode(index + 1);
    }
  }

  MoveToRightNode() {
    if(this.CanMoveToRightNode) {
      const index = Math.floor((this.MindNodesCount - 1) / 2);      
      
      this.MoveToMindNode(index);
    }
  }

  CreateMindNode() {
    const item = new MindNode(true, this, this.context);
    
    item.Id = Date.now();
    item.Label = '';
    item.Editable = true;
    item.BindHandlers();

    this.ul.appendChild(item);

    if(this.context && this.context.ToolBar) {
      this.context.ToolBar.ActiveNode = item;
      this.context.ToolBar.CanSave = true;
    }

    this.Collapsed = false;
  }
  
  RemoveMindNode(item: MindNodeInstance) {
    const node = (item as unknown) as MindNode;
    const index = this.MindNodeIndex(item);
    const length = this.MindNodesCount;

    node.UnBindHandlers?.();

    this.ul.removeChild(node);

    if(this.context && this.context.ToolBar) {
      this.context.ToolBar.CanSave = true;
    }

    let focusIndex = length - 2;

    if(length > index + 1) {
      focusIndex = index;
    }

    if(focusIndex >= 0) {
      this.MoveToMindNode(focusIndex); 
    } else if(this.context && this.context.ToolBar) {
      this.context.ToolBar.ActiveNode = this;
    }

    this.Collapsed = this.Collapsed;
  }

  OnNodeClicked(evt: MouseEvent) {
    evt.stopPropagation();

    if(!this.Active && this.context && this.context.ToolBar) {
      this.context.ToolBar.ActiveNode = this;        
    } 
  };

  OnNodeKeyPressed(evt: KeyboardEvent) {
    if(evt.code === 'Space' && !this.Editable) {
      evt.preventDefault();
      
      this.Editable = true;
    } else if(evt.code === 'Tab') {
      evt.preventDefault();

      this.CreateMindNode();
    } else if(evt.code === 'Enter' || evt.code === 'NumpadEnter') {
      evt.preventDefault();

      if(!this.Editable) {        
        this.parentMindNode?.CreateMindNode?.();        
      } else {
        this.Editable = false;
      }
    } else if(evt.code === 'Delete') {
      if(!this.Editable) {
        this.parentMindNode?.RemoveMindNode?.(this);
      }
    } else if(evt.code === 'ArrowLeft' || evt.code === 'Numpad4') {
      if(!this.Editable) {
        this.MoveToLeftNode();
      }
    } else if(evt.code === 'ArrowRight' || evt.code === 'Numpad6') {
      if(!this.Editable) {        
        this.MoveToRightNode();
      } 
    } else if(evt.code === 'ArrowUp' || evt.code === 'Numpad8') {
      this.MoveToUpNode();
    } else if(evt.code === 'ArrowDown' || evt.code === 'Numpad2') {
      this.MoveToDownNode();
    } else if(evt.code === 'KeyD') {
      if(evt.shiftKey) {
        if(!this.Editable) {
          this.childrenCollapsed = !this.childrenCollapsed;
  
          this.UpdateMindNodesCollapsed(this.childrenCollapsed);       
        }
      } else {
        if(!this.Editable) {
          this.Collapsed = !this.Collapsed;
        }
      }      
    }
  }
}
