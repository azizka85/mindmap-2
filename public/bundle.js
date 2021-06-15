(function () {
    'use strict';

    const MindMapContextKey = 'mindmap';
    class MindMapContext extends HTMLDivElement {
        toolBar;
        mindMap;
        constructor() {
            super();
            this.className = 'container';
        }
        get ToolBar() {
            return this.toolBar;
        }
        get MindMap() {
            return this.mindMap;
        }
        Init() {
            this.toolBar = this.querySelector('[is="tool-bar"]');
            this.mindMap = this.querySelector('[is="mind-map"]');
            this.toolBar?.Init?.(this);
            this.mindMap?.Init?.(this);
        }
    }

    class ToolBar extends HTMLDivElement {
        context;
        activeNode;
        editNodeTool;
        activateLeftNodeTool;
        activateUpNodeTool;
        activateDownNodeTool;
        activateRightNodeTool;
        saveDataTool;
        loadDataTool;
        constructor(init = false, context) {
            super();
            this.context = context;
            this.className = 'toolbar';
            if (init) {
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
        get ActiveNode() {
            return this.activeNode;
        }
        set ActiveNode(item) {
            if (this.activeNode) {
                this.activeNode.Active = false;
            }
            if (item) {
                item.Active = true;
            }
            this.activeNode = item;
            this.Update();
        }
        get CanSave() {
            return this.saveDataTool?.style.display !== 'none';
        }
        set CanSave(value) {
            if (this.saveDataTool) {
                this.saveDataTool.style.display = value ? '' : 'none';
            }
        }
        get CanActivateLeftNode() {
            return this.activeNode?.CanMoveToLeftNode || false;
        }
        get CanActivateUpNode() {
            return this.activeNode?.CanMoveToUpNode || false;
        }
        get CanActivateDownNode() {
            return this.activeNode?.CanMoveToDownNode || false;
        }
        get CanActivateRightNode() {
            return this.activeNode?.CanMoveToRightNode || false;
        }
        Init(context) {
            this.context = context;
            this.InitTools();
            this.BindHandlers();
            this.CanSave = false;
            this.Update();
        }
        InitTools() {
            this.editNodeTool = this.querySelector('[data-action="edit-node"]');
            this.activateLeftNodeTool = this.querySelector('[data-action="activate-left-node"]');
            this.activateUpNodeTool = this.querySelector('[data-action="activate-up-node"]');
            this.activateDownNodeTool = this.querySelector('[data-action="activate-down-node"]');
            this.activateRightNodeTool = this.querySelector('[data-action="activate-right-node"]');
            this.saveDataTool = this.querySelector('[data-action="save-data"]');
            this.loadDataTool = this.querySelector('[data-action="load-data"]');
        }
        BindHandlers() {
            if (this.editNodeTool) {
                this.editNodeTool.onclick = this.EditNode.bind(this);
            }
            if (this.activateLeftNodeTool) {
                this.activateLeftNodeTool.onclick = this.ActivateLeftNode.bind(this);
            }
            if (this.activateUpNodeTool) {
                this.activateUpNodeTool.onclick = this.ActivateUpNode.bind(this);
            }
            if (this.activateDownNodeTool) {
                this.activateDownNodeTool.onclick = this.ActivateDownNode.bind(this);
            }
            if (this.activateRightNodeTool) {
                this.activateRightNodeTool.onclick = this.ActivateRightNode.bind(this);
            }
            if (this.saveDataTool) {
                this.saveDataTool.onclick = this.SaveToLocalStorage.bind(this);
            }
            if (this.loadDataTool) {
                this.loadDataTool.onclick = this.LoadFromLocalStorage.bind(this);
            }
        }
        EditNode() {
            if (this.activeNode) {
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
            if (this.editNodeTool) {
                this.editNodeTool.style.display = this.activeNode ? '' : 'none';
            }
            if (this.activateLeftNodeTool) {
                this.activateLeftNodeTool.style.display = this.CanActivateLeftNode ? '' : 'none';
            }
            if (this.activateUpNodeTool) {
                this.activateUpNodeTool.style.display = this.CanActivateUpNode ? '' : 'none';
            }
            if (this.activateDownNodeTool) {
                this.activateDownNodeTool.style.display = this.CanActivateDownNode ? '' : 'none';
            }
            if (this.activateRightNodeTool) {
                this.activateRightNodeTool.style.display = this.CanActivateRightNode ? '' : 'none';
            }
        }
    }

    class MindNode extends HTMLLIElement {
        parentMindNode;
        context;
        article;
        ul;
        childrenCollapsed;
        constructor(init = false, parentMindNode, context) {
            super();
            this.parentMindNode = parentMindNode;
            this.context = context;
            if (init) {
                this.article = document.createElement('article');
                this.appendChild(this.article);
                this.article.tabIndex = 1;
                this.ul = document.createElement('ul');
                this.appendChild(this.ul);
                this.ListVisible = false;
            }
            this.childrenCollapsed = false;
        }
        get Id() {
            return +this.id;
        }
        set Id(value) {
            this.id = '' + value;
        }
        get Label() {
            return this.article.textContent;
        }
        set Label(value) {
            this.article.textContent = value;
        }
        set ListVisible(value) {
            this.ul.style.display = value ? '' : 'none';
        }
        get MindNode() {
            const node = {
                id: this.Id,
                label: this.Label,
                children: this.MindNodes
            };
            return node;
        }
        set MindNode(node) {
            this.Id = node.id;
            this.Label = node.label;
            this.Update(node.children);
        }
        get MindNodes() {
            const nodes = [];
            for (let i = 0; i < this.MindNodesCount; i++) {
                const elem = this.ul.children.item(i);
                const node = elem.MindNode;
                if (node) {
                    nodes.push(node);
                }
            }
            return nodes;
        }
        get MindNodesCount() {
            return this.ul.children.length;
        }
        get Active() {
            return this.article.classList.contains('active');
        }
        set Active(value) {
            if (value) {
                this.article.classList.add('active');
                this.article.focus();
            }
            else {
                this.article.classList.remove('active');
                this.article.blur();
            }
        }
        get Collapsed() {
            return this.article.classList.contains('collapsed');
        }
        set Collapsed(value) {
            if (value) {
                this.article.classList.add('collapsed');
            }
            else {
                this.article.classList.remove('collapsed');
            }
            this.ListVisible = this.MindNodesCount > 0 && !value;
        }
        get Editable() {
            return this.article.classList.contains('editable');
        }
        set Editable(value) {
            this.article.contentEditable = value ? 'true' : 'false';
            if (value) {
                this.article.classList.add('editable');
            }
            else {
                this.article.classList.remove('editable');
            }
        }
        get CanMoveToLeftNode() {
            return this.parentMindNode?.Id !== undefined;
        }
        get CanMoveToUpNode() {
            const index = this.parentMindNode?.MindNodeIndex?.(this) || 0;
            return index > 0;
        }
        get CanMoveToDownNode() {
            const index = this.parentMindNode?.MindNodeIndex?.(this) || 0;
            const length = this.parentMindNode?.MindNodesCount || 0;
            return index >= 0 && index < length - 1;
        }
        get CanMoveToRightNode() {
            return !this.Collapsed && this.MindNodesCount > 0;
        }
        Init(parentMindNode, context) {
            this.parentMindNode = parentMindNode;
            this.context = context;
            if (this.children.length > 0) {
                this.article = this.children.item(0);
            }
            else {
                this.article = document.createElement('article');
                this.appendChild(this.article);
            }
            this.article.tabIndex = 1;
            if (this.children.length > 1) {
                this.ul = this.children.item(1);
            }
            else {
                this.ul = document.createElement('ul');
                this.appendChild(this.ul);
            }
            this.BindHandlers();
            if (this.MindNodesCount > 0) {
                for (let i = 0; i < this.MindNodesCount; i++) {
                    this.ul.children.item(i).Init?.(this, this.context);
                }
            }
            else {
                this.ListVisible = false;
            }
        }
        Update(nodes) {
            this.ul.innerHTML = '';
            nodes.forEach(node => {
                const elem = new MindNode(true, this, this.context);
                elem.MindNode = node;
                elem.Collapsed = false;
                elem.BindHandlers();
                this.ul.appendChild(elem);
            });
        }
        BindHandlers() {
            this.article.onclick = this.OnNodeClicked.bind(this);
            this.article.onkeydown = this.OnNodeKeyPressed.bind(this);
        }
        UnBindHandlers() {
            this.article.onclick = null;
            this.article.onkeydown = null;
        }
        UpdateMindNodesCollapsed(collapsed) {
            this.Collapsed = false;
            for (let i = 0; i < this.MindNodesCount; i++) {
                this.ul.children.item(i).Collapsed = collapsed;
            }
        }
        MindNodeIndex(item) {
            let index = -1;
            for (let i = 0; i < this.ul.children.length; i++) {
                if (this.ul.children.item(i).Id === item.Id) {
                    index = i;
                    break;
                }
            }
            return index;
        }
        MoveToMindNode(index) {
            if (this.context && this.context.ToolBar && index < this.MindNodesCount) {
                this.context.ToolBar.ActiveNode = this.ul.children.item(index);
            }
        }
        MoveToLeftNode() {
            if (this.context && this.context.ToolBar && this.CanMoveToLeftNode) {
                this.context.ToolBar.ActiveNode = this.parentMindNode;
            }
        }
        MoveToUpNode() {
            if (this.CanMoveToUpNode) {
                const index = this.parentMindNode.MindNodeIndex(this);
                this.parentMindNode.MoveToMindNode(index - 1);
            }
        }
        MoveToDownNode() {
            if (this.CanMoveToDownNode) {
                const index = this.parentMindNode.MindNodeIndex(this);
                this.parentMindNode.MoveToMindNode(index + 1);
            }
        }
        MoveToRightNode() {
            if (this.CanMoveToRightNode) {
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
            if (this.context && this.context.ToolBar) {
                this.context.ToolBar.ActiveNode = item;
                this.context.ToolBar.CanSave = true;
            }
            this.Collapsed = false;
        }
        RemoveMindNode(item) {
            const node = item;
            const index = this.MindNodeIndex(item);
            const length = this.MindNodesCount;
            node.UnBindHandlers?.();
            this.ul.removeChild(node);
            if (this.context && this.context.ToolBar) {
                this.context.ToolBar.CanSave = true;
            }
            let focusIndex = length - 2;
            if (length > index + 1) {
                focusIndex = index;
            }
            if (focusIndex >= 0) {
                this.MoveToMindNode(focusIndex);
            }
            else if (this.context && this.context.ToolBar) {
                this.context.ToolBar.ActiveNode = this;
            }
            this.Collapsed = this.Collapsed;
        }
        OnNodeClicked(evt) {
            evt.stopPropagation();
            if (!this.Active && this.context && this.context.ToolBar) {
                this.context.ToolBar.ActiveNode = this;
            }
        }
        ;
        OnNodeKeyPressed(evt) {
            if (evt.code === 'Space' && !this.Editable) {
                evt.preventDefault();
                this.Editable = true;
            }
            else if (evt.code === 'Tab') {
                evt.preventDefault();
                this.CreateMindNode();
            }
            else if (evt.code === 'Enter' || evt.code === 'NumpadEnter') {
                evt.preventDefault();
                if (!this.Editable) {
                    this.parentMindNode?.CreateMindNode?.();
                }
                else {
                    this.Editable = false;
                }
            }
            else if (evt.code === 'Delete') {
                if (!this.Editable) {
                    this.parentMindNode?.RemoveMindNode?.(this);
                }
            }
            else if (evt.code === 'ArrowLeft' || evt.code === 'Numpad4') {
                if (!this.Editable) {
                    this.MoveToLeftNode();
                }
            }
            else if (evt.code === 'ArrowRight' || evt.code === 'Numpad6') {
                if (!this.Editable) {
                    this.MoveToRightNode();
                }
            }
            else if (evt.code === 'ArrowUp' || evt.code === 'Numpad8') {
                this.MoveToUpNode();
            }
            else if (evt.code === 'ArrowDown' || evt.code === 'Numpad2') {
                this.MoveToDownNode();
            }
            else if (evt.code === 'KeyD') {
                if (evt.shiftKey) {
                    if (!this.Editable) {
                        this.childrenCollapsed = !this.childrenCollapsed;
                        this.UpdateMindNodesCollapsed(this.childrenCollapsed);
                    }
                }
                else {
                    if (!this.Editable) {
                        this.Collapsed = !this.Collapsed;
                    }
                }
            }
        }
    }

    class MindMap extends HTMLUListElement {
        context;
        constructor(context) {
            super();
            this.context = context;
            this.className = 'mindmap';
            this.onclick = this.DisposeActiveNode.bind(this);
        }
        get Id() {
            return undefined;
        }
        get MindNodes() {
            const nodes = [];
            for (let i = 0; i < this.MindNodesCount; i++) {
                const elem = this.children.item(i);
                const node = elem.MindNode;
                if (node) {
                    nodes.push(node);
                }
            }
            return nodes;
        }
        get MindNodesCount() {
            return this.children.length;
        }
        Init(context) {
            this.context = context;
            for (let i = 0; i < this.children.length; i++) {
                this.children.item(i).Init?.(this, this.context);
            }
        }
        Update(nodes) {
            this.innerHTML = '';
            nodes.forEach(node => {
                const elem = new MindNode(true, this, this.context);
                elem.MindNode = node;
                elem.Collapsed = false;
                elem.BindHandlers();
                this.appendChild(elem);
            });
        }
        DisposeActiveNode() {
            if (this.context && this.context.ToolBar) {
                this.context.ToolBar.ActiveNode = undefined;
            }
        }
        MindNodeIndex(item) {
            let index = -1;
            for (let i = 0; i < this.children.length; i++) {
                if (this.children.item(i).Id === item.Id) {
                    index = i;
                    break;
                }
            }
            return index;
        }
        MoveToMindNode(index) {
            if (this.context && this.context.ToolBar && index < this.children.length) {
                this.context.ToolBar.ActiveNode = this.children.item(index);
            }
        }
        CreateMindNode() {
            const item = new MindNode(true, this, this.context);
            item.Id = Date.now();
            item.Label = '';
            item.Editable = true;
            item.BindHandlers();
            this.appendChild(item);
            if (this.context && this.context.ToolBar) {
                this.context.ToolBar.ActiveNode = item;
                this.context.ToolBar.CanSave = true;
            }
        }
        RemoveMindNode(item) {
            const node = item;
            const index = this.MindNodeIndex(item);
            const length = this.MindNodesCount;
            if (length < 2)
                return;
            node.UnBindHandlers?.();
            this.removeChild(node);
            if (this.context && this.context.ToolBar) {
                this.context.ToolBar.CanSave = true;
            }
            let focusIndex = length - 2;
            if (length > index + 1) {
                focusIndex = index;
            }
            if (focusIndex >= 0) {
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
            }
            catch (error) {
                console.error(error);
            }
            if (!data || typeof data !== 'object') {
                const nodes = [{
                        id: Date.now(),
                        label: 'Press Space or double click to edit',
                        children: []
                    }];
                data = nodes;
            }
            this.Update(data);
        }
    }

    customElements.define('mind-map-context', MindMapContext, { extends: 'div' });
    customElements.define('tool-bar', ToolBar, { extends: 'div' });
    customElements.define('mind-map', MindMap, { extends: 'ul' });
    customElements.define('mind-node', MindNode, { extends: 'li' });

}());
//# sourceMappingURL=bundle.js.map
