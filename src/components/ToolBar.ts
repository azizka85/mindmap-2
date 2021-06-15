import { MindMapContext, MindNodeInstance, ToolBarInstance } from "./MindMapContext";

export class ToolBar extends HTMLDivElement implements ToolBarInstance {
  protected activeNode?: MindNodeInstance;

  protected editNodeTool?: HTMLElement;
  protected activateLeftNodeTool?: HTMLElement;
  protected activateUpNodeTool?: HTMLElement;
  protected activateDownNodeTool?: HTMLElement;
  protected activateRightNodeTool?: HTMLElement;
  protected saveDataTool?: HTMLElement;
  protected loadDataTool?: HTMLElement;

  constructor(init = false, protected context?: MindMapContext) {
    super();

    this.className = 'toolbar';   
    
    if(init) {
      this.innerHTML = `
        <svg class="tool" viewBox="0 0 16 16" data-action="edit-node">
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
        </svg>
        <svg class="tool" viewBox="0 0 16 16" data-action="activate-left-node">
          <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
        </svg>
        <svg class="tool" viewBox="0 0 16 16" data-action="activate-up-node">
          <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
        </svg>
        <svg class="tool" viewBox="0 0 16 16" data-action="activate-down-node">
          <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
        </svg>
        <svg class="tool" viewBox="0 0 16 16" data-action="activate-right-node">
          <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
        </svg>
        <svg class="tool" viewBox="0 0 16 16" data-action="save-data">
          <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
        </svg>
        <svg class="tool" viewBox="0 0 16 16" data-action="load-data">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
          <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
        </svg>
      `;

      this.InitTools();
      this.BindHandlers();
  
      this.CanSave = false;
      this.Update();      
    }
  }

  get ActiveNode(): MindNodeInstance | undefined {
    return this.activeNode;
  }

  set ActiveNode(item: MindNodeInstance | undefined) {
    if(this.activeNode) {
      this.activeNode.Active = false;
    }

    if(item) {
      item.Active = true;
    }

    this.activeNode = item;
    this.Update();
  }

  get CanSave(): boolean {
    return this.saveDataTool?.style.display !== 'none';
  }

  set CanSave(value: boolean) {
    if(this.saveDataTool) {
      this.saveDataTool.style.display = value ? '' : 'none';
    }
  }

  get CanActivateLeftNode(): boolean {
    return this.activeNode?.CanMoveToLeftNode || false;
  }

  get CanActivateUpNode(): boolean {
    return this.activeNode?.CanMoveToUpNode || false;
  }

  get CanActivateDownNode(): boolean {
    return this.activeNode?.CanMoveToDownNode || false;
  }

  get CanActivateRightNode(): boolean {
    return this.activeNode?.CanMoveToRightNode || false;
  }  

  Init(context?: MindMapContext) {
    this.context = context;    

    this.InitTools();
    this.BindHandlers();

    this.CanSave = false;
    this.Update(); 
  }

  protected InitTools() {
    this.editNodeTool = this.querySelector('[data-action="edit-node"]');
    this.activateLeftNodeTool = this.querySelector('[data-action="activate-left-node"]'); 
    this.activateUpNodeTool = this.querySelector('[data-action="activate-up-node"]');
    this.activateDownNodeTool = this.querySelector('[data-action="activate-down-node"]');
    this.activateRightNodeTool = this.querySelector('[data-action="activate-right-node"]');
    this.saveDataTool = this.querySelector('[data-action="save-data"]');
    this.loadDataTool = this.querySelector('[data-action="load-data"]');
  }

  BindHandlers() {
    if(this.editNodeTool) {
      this.editNodeTool.onclick = this.EditNode.bind(this);
    }

    if(this.activateLeftNodeTool) {
      this.activateLeftNodeTool.onclick = this.ActivateLeftNode.bind(this);
    }
    
    if(this.activateUpNodeTool) {
      this.activateUpNodeTool.onclick = this.ActivateUpNode.bind(this);
    }
    
    if(this.activateDownNodeTool) {
      this.activateDownNodeTool.onclick = this.ActivateDownNode.bind(this);
    }    

    if(this.activateRightNodeTool) {
      this.activateRightNodeTool.onclick = this.ActivateRightNode.bind(this);
    }
    
    if(this.saveDataTool) {
      this.saveDataTool.onclick = this.SaveToLocalStorage.bind(this);    
    }    

    if(this.loadDataTool) {
      this.loadDataTool.onclick = this.LoadFromLocalStorage.bind(this);
    }
  }

  EditNode() {
    if(this.activeNode) {
      this.activeNode.Editable = !this.activeNode.Editable;
    }
  }

  ActivateLeftNode() {
    this.activeNode?.MoveToLeftNode?.();
  }

  ActivateUpNode() {
    this.activeNode?.MoveToUpNode?.();
  }

  ActivateDownNode() {
    this.activeNode?.MoveToDownNode?.();
  }

  ActivateRightNode() {
    this.activeNode?.MoveToRightNode?.();
  }

  SaveToLocalStorage() {
    this.context?.MindMap?.SaveToLocalStorage?.();
  }

  LoadFromLocalStorage() {
    this.context?.MindMap?.LoadFromLocalStorage?.();
  }

  Update() {
    if(this.editNodeTool) {
      this.editNodeTool.style.display = this.activeNode ? '' : 'none';
    }

    if(this.activateLeftNodeTool) {
      this.activateLeftNodeTool.style.display = this.CanActivateLeftNode ? '' : 'none';
    }
    
    if(this.activateUpNodeTool) {
      this.activateUpNodeTool.style.display = this.CanActivateUpNode ? '' : 'none';
    }

    if(this.activateDownNodeTool) {
      this.activateDownNodeTool.style.display = this.CanActivateDownNode ? '' : 'none';
    }
 
    if(this.activateRightNodeTool) {
      this.activateRightNodeTool.style.display = this.CanActivateRightNode ? '' : 'none';        
    }    
  }
}
