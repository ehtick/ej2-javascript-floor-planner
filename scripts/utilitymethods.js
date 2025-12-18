const {
  NodeProperties,
  TextProperties,
  PrintSettings,
} = require('./common.js');
var textProperties = new TextProperties();
class UtilityMethods {
    applyNodeStyle(propertyName, node, value) {
      const addInfo = node.addInfo || {};
      switch (propertyName) {
        case 'fillcolor':
          node.style.fill = this.getColor(value);
          if (value && value.checked) {
            NodeProperties.prototype.getGradient(node);
          }
          break;
        case 'strokecolor':
          node.style.strokeColor = this.getColor(value.value);
          break;
        case 'strokewidth':
          node.style.strokeWidth = value.value;
          break;
        case 'strokestyle':
          node.style.strokeDashArray = value.value;
          break;
        case 'opacity':
          node.style.opacity = value.value / 100;
          document.getElementById('nodeOpacitySliderText').value = value.value + '%';
          break;
        case 'gradient':
          if (value && !value.checked) {
            node.style.gradient.type = 'None';
          } else {
            NodeProperties.prototype.getGradient(node);
          }
          break;
        case 'gradientdirection':
        case 'gradientcolor':
          NodeProperties.prototype.getGradient(node);
          break;
      }
    }
  
    getColor(colorName) {
      if (window.navigator.msSaveBlob && colorName.length === 9) {
        return colorName.substring(0, 7);
      }
      return colorName;
    }
  
    updateTextFontProperties(propertyName, annotation, args) {
      switch (propertyName) {
        case 'fontfamily':
          annotation.fontFamily = args.propertyValue.value;
          break;
        case 'fontsize':
          annotation.fontSize =  args.propertyValue.value;
          break;
        case 'fontcolor':
          annotation.color = this.getColor(args.propertyValue.value);
          break;
        case 'opacity':
          annotation.opacity =  args.propertyValue.value / 100;
          document.getElementById('textOpacityText').value =  args.propertyValue.value + '%';
          break;
      }
    }
  
    updateToolbarState(toolbarName, isSelected, index) {
      const toolbarTextStyle = document.getElementById(toolbarName)?.ej2_instances[0];
      if (toolbarTextStyle) {
        let cssClass = toolbarTextStyle.items[index].cssClass;
        toolbarTextStyle.items[index].cssClass = isSelected ? `${cssClass} tb-item-selected` : cssClass.replace(' tb-item-selected', '');
        toolbarTextStyle.dataBind();
      }
    }
  
    updateTextAlign(textAlign) {
      const toolbarTextSubAlignment = document.getElementById('toolbarTextSubAlignment')?.ej2_instances[0];
      if (toolbarTextSubAlignment) {
        toolbarTextSubAlignment.items.forEach((item, i) => {
          item.cssClass = item.cssClass.replace(' tb-item-selected', '');
        });
        const index = textAlign === 'Left' ? 0 : (textAlign === 'Center' ? 1 : 2);
        toolbarTextSubAlignment.items[index].cssClass += ' tb-item-selected';
      }
    }
  
    updateHorVertAlign(horizontalAlignment, verticalAlignment) {
      const toolbarHorVerAlignment = document.getElementById('toolbarTextAlignment')?.ej2_instances[0];
      if (toolbarHorVerAlignment) {
        toolbarHorVerAlignment.items.forEach(item => {
          item.cssClass = item.cssClass.replace(' tb-item-selected', '');
        });
        let index = horizontalAlignment === 'Right' ? 0 : (horizontalAlignment === 'Center' ? 1 : 2);
        toolbarHorVerAlignment.items[index].cssClass += ' tb-item-selected';
        index = verticalAlignment === 'Top' ? 3 : (verticalAlignment === 'Center' ? 4 : 5);
        toolbarHorVerAlignment.items[index].cssClass += ' tb-item-selected';
      }
    }
  
    updateTextProperties1(propertyName, propertyValue, annotation) {
      switch (propertyName) {
        case 'bold':
          annotation.bold = !annotation.bold;
          this.updateToolbarState('toolbarTextStyle', annotation.bold, 0);
          break;
        case 'italic':
          annotation.italic = !annotation.italic;
          this.updateToolbarState('toolbarTextStyle', annotation.italic, 1);
          break;
        case 'underline':
          textProperties.textDecoration = !textProperties.textDecoration;
          annotation.textDecoration = annotation.textDecoration === 'None' || !annotation.textDecoration ? 'Underline' : 'None';
          this.updateToolbarState('toolbarTextStyle', textProperties.textDecoration, 2);
          break;
        case 'aligntextleft':
        case 'aligntextright':
        case 'aligntextcenter':
          annotation.textAlign = propertyValue.toString().replace('AlignText', '');
          this.updateTextAlign(annotation.textAlign);
          break;
      }
    }
  
    getOffset(position) {
      switch (position.toLowerCase()) {
        case 'topleft':
          return { x: 0, y: 0 };
        case 'topcenter':
          return { x: 0.5, y: 0 };
        case 'topright':
          return { x: 1, y: 0 };
        case 'middleleft':
          return { x: 0, y: 0.5 };
        default:
          return { x: 0.5, y: 0.5 };
        case 'middleright':
          return { x: 1, y: 0.5 };
        case 'bottomleft':
          return { x: 0, y: 1 };
        case 'bottomcenter':
          return { x: 0.5, y: 1 };
        case 'bottomright':
          return { x: 1, y: 1 };
      }
    }
  
    onClickDisable(args) {
      if(args === false)
        {
            for(i=8;i<33;i++)
            {
                if(toolbarEditor.items[i].type !=='Separator'){
                    if(i<=17)
                    {
                      toolbarEditor.items[i].template = '<div></div>';
                    }
                    else if(i>17 && i!==31){
                      toolbarEditor.items[i].template = '';
                    }
                    else if(i === 31) {
                      var obj =  diagram.selectedItems.nodes.length>0 ?diagram.selectedItems.nodes[0] : diagram.selectedItems.connectors[0];
                      if((obj.annotations.length && obj.annotations[0].content )|| (obj.shape.type === "Text")) 
                      {
                        toolbarEditor.items[i].template = '';
                        toolbarEditor.hideItem(i+1,false);
                      }
                      else{
                        toolbarEditor.items[i].template = '<div></div>';
                        toolbarEditor.hideItem(i+1,true);
                      }
                   }
                }
            }
        }
        else{
          for(i=8;i<33;i++)
          {
              if(toolbarEditor.items[i].type !=='Separator'){
                toolbarEditor.items[i].template = '<div></div>';
              }
             
          }
      }
    }
  
    checkCondition(i) {
      const obj =diagram.ej2_instances[0].nodes.length > 0 ?diagram.ej2_instances[0].nodes[0] :diagram.ej2_instances[0].connectors[0];
      return (obj.annotations.length && obj.annotations[0].content) || (obj.shape.type === "Text") ? '' : '<div></div>';
    }
  
    updateSelection(item) {
      item.parentObj.items.forEach(objItem => {
        objItem.iconCss = item.text === objItem.text ? 'sf-icon-check-tick' : '';
      });
    }
  
    removeSelectedToolbarItem() {
      var toolbarEditor = document.getElementById('toolbarEditor').ej2_instances[0];;
      for (var i = 0; i < toolbarEditor.items.length; i++) {
          var item = toolbarEditor.items[i];
          if (item.cssClass.indexOf('tb-item-selected') !== -1) {
              item.cssClass = item.cssClass.replace(' tb-item-selected', '');
          }
      }
      toolbarEditor.dataBind();
    }
  
    getPaperSize(args) {
      const paperSize = {};
      switch (args) {
        case 'Letter':
          Object.assign(paperSize, { pageWidth: 816, pageHeight: 1056 });
          break;
        case 'Legal':
          Object.assign(paperSize, { pageWidth: 816, pageHeight: 1344 });
          break;
        case 'Tabloid':
          Object.assign(paperSize, { pageWidth: 1056, pageHeight: 1632 });
          break;
        case 'A0':
          Object.assign(paperSize, { pageWidth: 3179, pageHeight: 4494 });
          break;
        case 'A1':
          Object.assign(paperSize, { pageWidth: 2245, pageHeight: 3179 });
          break;
        case 'A2':
          Object.assign(paperSize, { pageWidth: 1587, pageHeight: 2245 });
          break;
        case 'A3':
          Object.assign(paperSize, { pageWidth: 1122, pageHeight: 1587 });
          break;
        case 'A4':
          Object.assign(paperSize, { pageWidth: 793, pageHeight: 1122 });
          break;
        case 'A5':
          Object.assign(paperSize, { pageWidth: 559, pageHeight: 793 });
          break;
        case 'A6':
          Object.assign(paperSize, { pageWidth: 396, pageHeight: 559 });
          break;
      }
      return paperSize;
    }
  
    paperListChange(args) {
      document.getElementById('pageDimension').style.display = 'none';
      document.getElementById('pageOrientation').style.display = '';
      const viewmenu = document.getElementById('diagram-menu').ej2_instances[0];  
      const value = args.value || args.item.value;
      const { pageWidth, pageHeight } = this.getPaperSize(value);
      this.setPageSize(pageWidth, pageHeight);
      this.bindPaperSize(viewmenu.items[3].items[1], args.value);
     diagram.ej2_instances[0].dataBind();
    }
  
    setPageSize(pageWidth, pageHeight) {
      if (pageWidth && pageHeight) {
        if (diagram.ej2_instances[0].pageSettings.orientation = 'Portrait') {
          if (pageWidth > pageHeight) {
            [pageWidth, pageHeight] = [pageHeight, pageWidth];
          }
        } else {
          if (pageHeight > pageWidth) {
            [pageHeight, pageWidth] = [pageWidth, pageHeight];
          }
        }
       diagram.ej2_instances[0].pageSettings.width = pageWidth;
       diagram.ej2_instances[0].pageSettings.height = pageHeight;
      } else {
        document.getElementById('pageOrientation').style.display = 'none';
        document.getElementById('pageDimension').style.display = '';
       diagram.ej2_instances[0].pageSettings.width = 1460;
       diagram.ej2_instances[0].pageSettings.height = 600;
      }
    }
  
    bindPaperSize(items, value) {
      items.items.forEach(item => {
        item.iconCss = value === item.value ? 'sf-icon-check-tick' : '';
      });
    }
  
    pageOrientationChange(args) {
      if (args.target) {
        const btnViewMenu = document.getElementById('diagram-menu').ej2_instances[0];
        const target = args.target;
        const items = btnViewMenu.items[3].items;
        const option = target.id || (args.currentTarget.ej2_instances[0].iconCss === 'sf-icon-portrait' ? 'pagePortrait' : 'pageLandscape');
  
        if (option === 'pagePortrait') {
          this.setPortraitOrientation(true);
          items[0].items[0].iconCss = '';
          items[0].items[1].iconCss = 'sf-icon-check-tick';
          document.getElementById('pageLandscape').classList.remove('e-active');
        } else {
          this.setPortraitOrientation(false);
          items[0].items[0].iconCss = 'sf-icon-check-tick';
          items[0].items[1].iconCss = '';
          document.getElementById('pagePortrait').classList.remove('e-active');
        }
  
       diagram.ej2_instances[0].dataBind();
       diagram.ej2_instances[0].pageSettings.pageWidth =diagram.ej2_instances[0].pageSettings.width;
       diagram.ej2_instances[0].pageSettings.pageHeight =diagram.ej2_instances[0].pageSettings.height;
      }
    }
  
    setPortraitOrientation(isPortrait) {
     diagram.ej2_instances[0].pageSettings.isPortrait = isPortrait;
     diagram.ej2_instances[0].pageSettings.isLandscape = !isPortrait;
     diagram.ej2_instances[0].pageSettings.orientation = isPortrait ? 'Portrait' : 'Landscape';
    }
  
    pageDimensionChange(args) {
      if (args.event) {
        let pageWidth = Number(diagram.ej2_instances[0].pageSettings.width);
        let pageHeight = Number(diagram.ej2_instances[0].pageSettings.height);
        let target = args.event.target;
        target = target.tagName.toLowerCase() === 'span' ? target.parentElement.children[0] : target;
        if (target.id === 'pageWidth') {
          pageWidth = Number(target.value.replace(/,/g, ''));
        } else {
          pageHeight = Number(target.value.replace(/,/g, ''));
        }
        if (pageWidth && pageHeight) {
          this.setPageOrientationAndSize(pageWidth, pageHeight);
        }
      }
    }
  
    setPageOrientationAndSize(pageWidth, pageHeight) {
      if (pageWidth > pageHeight) {
        this.setPortraitOrientation(false);
      } else {
        this.setPortraitOrientation(true);
      }
     diagram.ej2_instances[0].pageSettings.pageWidth =diagram.ej2_instances[0].pageSettings.width = pageWidth;
     diagram.ej2_instances[0].pageSettings.pageHeight =diagram.ej2_instances[0].pageSettings.height = pageHeight;
     diagram.ej2_instances[0].dataBind();
    }
  
    pageBackgroundChange1(args) {
      if (args.currentValue) {
       diagram.ej2_instances[0].pageSettings.background = { color: args.currentValue.rgba };
       diagram.ej2_instances[0].dataBind();
      }
    }
  
    pageBreaksChange(args) {
      const btnViewMenu = document.getElementById('diagram-menu').ej2_instances[0];
      const items = btnViewMenu.items[4].items;
      if (args.event) {
       diagram.ej2_instances[0].pageSettings.pageBreaks = args.checked;
       diagram.ej2_instances[0].pageSettings.showPageBreaks = args.checked;
       items[5].iconCss = args.checked === true ? 'sf-icon-check-tick' : '';
      }
    }
  
    getPosition(offset) {
      if (offset.x === 0 && offset.y === 0) return 'TopLeft';
      if (offset.x === 0.5 && offset.y === 0) return 'TopCenter';
      if (offset.x === 1 && offset.y === 0) return 'TopRight';
      if (offset.x === 0 && offset.y === 0.5) return 'MiddleLeft';
      if (offset.x === 1 && offset.y === 0.5) return 'MiddleRight';
      if (offset.x === 0 && offset.y === 1) return 'BottomLeft';
      if (offset.x === 0.5 && offset.y === 1) return 'BottomCenter';
      if (offset.x === 1 && offset.y === 1) return 'BottomRight';
      return 'Center';
    }
  
    getHexColor(colorStr) {
      var a = document.createElement('div');
      a.style.color = colorStr;
      var colors = window.getComputedStyle(document.body.appendChild(a)).color.match(/\d+/g).map(function (a) {
          return parseInt(a, 10);
      });
      document.body.removeChild(a);
      return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : '';
    }
  
    getDialogButtons(dialogType) {
      const buttons = [];
      const dialogActions = {
        export: () => this.btnExportClick.bind(this),
        print: () => this.btnPrintClick.bind(this),
        hyperlink: () => this.btnHyperLink.bind(this)
      };
      if (dialogActions[dialogType]) {
        buttons.push({
          click: dialogActions[dialogType](),
          buttonModel: { content: dialogType.charAt(0).toUpperCase() + dialogType.slice(1), cssClass: 'e-flat e-db-primary', isPrimary: true }
        });
      }
      buttons.push({
        click: this.btnCancelClick.bind(this),
        buttonModel: { content: 'Cancel', cssClass: 'e-outline', isPrimary: true }
      });
      return buttons;
    }
  
    btnExportClick() {
     diagram.ej2_instances[0].exportDiagram({
        fileName: document.getElementById("exportfileName").value,
        format: exportFormat.value,
      });
      exportDialog.ej2_instances[0].hide();
    }
  
    btnPrintClick() {
      let pageWidth = PrintSettings.pageWidth;
      let pageHeight = PrintSettings.pageHeight;
      diagram.ej2_instances[0].print({
        region: PrintSettings.region,
        pageHeight: pageHeight,
        pageWidth: pageWidth,
        multiplePage: !PrintSettings.multiplePage,
        pageOrientation: PrintSettings.isPortrait ? 'Portrait' : 'Landscape'
      });
    }
  
    btnHyperLink() {
      const node =diagram.ej2_instances[0].selectedItems.nodes[0];
      if (node.annotations.length > 0) {
        node.annotations[0].hyperlink.link = document.getElementById('hyperlink').value;
        node.annotations[0].hyperlink.content = document.getElementById('hyperlinkText').value;
        this.applyToolTipforHyperlink(node);
       diagram.ej2_instances[0].dataBind();
      } else {
        const annotation = {
          hyperlink: {
            content: document.getElementById('hyperlinkText').value,
            link: document.getElementById('hyperlink').value
          }
        };
       diagram.ej2_instances[0].addLabels(node, [annotation]);
        this.applyToolTipforHyperlink(node);
     diagram.ej2_instances[0].dataBind();
    }
    hyperlinkDialog.ej2_instances[0].hide();
  }

  btnCancelClick(args) {
    const key = args.target.offsetParent.id;
    switch (key) {
      case 'exportDialog':
        exportDialog.hide();
        break;
      case 'hyperlinkDialog':
        hyperlinkDialog.ej2_instances[0].hide();
        break;
    }
  }

  applyToolTipforHyperlink(node) {
    node.constraints = ej.diagrams.NodeConstraints.Default & ~ej.diagrams.NodeConstraints.InheritTooltip | ej.diagrams.NodeConstraints.Tooltip;
    node.tooltip = {
      content: node.annotations[0].hyperlink.link, 
      relativeMode: 'Object',
      position: 'TopCenter', 
      showTipPointer: true,
    };
  }
  showColorPicker(propertyName, toolbarName) {
    const fillElement = document.getElementById(propertyName).parentElement.querySelector('.e-dropdown-btn');
    if (fillElement) {
      fillElement.click();
      const popupElement = document.getElementById(`${fillElement.id}-popup`);
      const bounds = document.querySelector(`.${toolbarName}`).getBoundingClientRect();
      popupElement.style.left = `${bounds.left}px`;
      popupElement.style.top = `${bounds.top + 40}px`;
    }
  }
}
module.exports = UtilityMethods;