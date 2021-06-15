export const MindMapContextKey = 'mindmap';

export interface MindMapBase {
  Init(context?: MindMapContext);
};

export interface ToolBarInstance extends MindMapBase {
  get ActiveNode(): MindNodeInstance | undefined;
  set ActiveNode(item: MindNodeInstance | undefined);

  get CanSave(): boolean;
  set CanSave(value: boolean);  
};

export interface MindNodeBase {
  get Id(): number | undefined;
  get MindNodesCount(): number;
  
  MindNodeIndex(item: MindNodeInstance): number;
  MoveToMindNode(index: number);

  CreateMindNode();
  RemoveMindNode(item: MindNodeInstance);
};

export interface MindMapInstance extends MindNodeBase, MindMapBase {  
  SaveToLocalStorage();
  LoadFromLocalStorage();
};

export interface MindNodeInstance extends MindNodeBase {  
  get Active(): boolean;
  set Active(value: boolean);

  get Editable(): boolean;
  set Editable(value: boolean);

  get CanMoveToLeftNode(): boolean;
  get CanMoveToUpNode(): boolean;
  get CanMoveToDownNode(): boolean;
  get CanMoveToRightNode(): boolean;

  MoveToLeftNode();
  MoveToUpNode();
  MoveToDownNode();
  MoveToRightNode();
};

export interface MindNodeEntity {
  id: number,
  label: string,
  children: MindNodeEntity[]
};

export class MindMapContext extends HTMLDivElement {
  protected toolBar?: ToolBarInstance;
  protected mindMap?: MindMapInstance;

  constructor() {
    super();

    this.className = 'container';
  }

  get ToolBar(): ToolBarInstance | undefined {
    return this.toolBar;
  }  

  get MindMap(): MindMapInstance | undefined {
    return this.mindMap;
  }

  Init() {
    this.toolBar = (this.querySelector('[is="tool-bar"]') as unknown) as ToolBarInstance; 
    this.mindMap = (this.querySelector('[is="mind-map"]') as unknown) as MindMapInstance;

    this.toolBar?.Init?.(this);
    this.mindMap?.Init?.(this);
  }
}
