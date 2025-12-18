var UtilityMethods = require("./utilitymethods.js");
const {
  ConnectorProperties,
  TextProperties,
  enableToolbarItems
} = require('./common.js');

const nodeProperties = require('./common.js');
const textProperties = require('./common.js');

class DiagramClientSideEvents {
  updateNodePropertiesInView(selectedItems) {
    if (selectedItems.nodes.length) {
      let node = selectedItems.nodes[0];
      const nodeOffsetX = document.getElementById('nodeOffsetX').ej2_instances[0];
      const nodeOffsetY = document.getElementById('nodeOffsetY').ej2_instances[0];
      const nodeWidth = document.getElementById('nodeWidth').ej2_instances[0];
      const nodeHeight = document.getElementById('nodeHeight').ej2_instances[0];
      const nodeAngle = document.getElementById('nodeRotateAngle').ej2_instances[0];
      const nodeStrokeWidth = document.getElementById('nodeStrokeWidth').ej2_instances[0];
      const nodeOpacitySlider = document.getElementById('nodeOpacitySlider').ej2_instances[0];
      const nodeFillColor = document.getElementById('nodeFillColor').ej2_instances[0];
      const nodeStrokeColor = document.getElementById('nodeStrokeColor').ej2_instances[0];
      const fontFamily = document.getElementById('fontFamily').ej2_instances[0];
      const fontSizeTextProperties = document.getElementById('fontSizeTextProperties').ej2_instances[0];
      const opacityTextSlider = document.getElementById('opacityTextSlider').ej2_instances[0];
      const textColor = document.getElementById('textColor').ej2_instances[0];
      const ddlTextPosition = document.getElementById('ddlTextPosition').ej2_instances[0];
      nodeOffsetX.value = node.offsetX;
      nodeOffsetY.value = node.offsetY;
      nodeWidth.value = node.width;
      nodeHeight.value = node.height;
      nodeAngle.value = node.rotateAngle;
      nodeStrokeWidth.value = node.style.strokeWidth;
      nodeOpacitySlider.value = node.style.opacity * 100;
      nodeFillColor.value = node.style.fill;
      nodeStrokeColor.value = node.style.strokeColor;
      if (node.annotations[0]) {
        fontFamily.value = node.annotations[0].style.fontFamily;
        ddlTextPosition.value = node.annotations[0].style.fontSize;
        opacityTextSlider.value = node.annotations[0].style.opacity * 100;
        fontSizeTextProperties.value = node.annotations[0].style.fontSize;
        textColor.value = node.annotations[0].style.color;
      } else if (node.shape && node.shape.type === 'Text') {
        opacityTextSlider.value = node.style.opacity * 100;
      }
    }
    else if (selectedItems.connectors.length) {
      let connector = selectedItems.connectors[0];
      const lineWidth = document.getElementById('lineWidth').ej2_instances[0];
      const connectorOpacityText = document.getElementById('connectorOpacityText').ej2_instances[0];
      lineWidth.value = connector.style.strokeWidth;
      connectorOpacityText.value = connector.style.opacity * 100;
      if (connector.annotations[0]) {
          const opacityConnectorTextSlider = document.getElementById('opacityTextSlider').ej2_instances[0];
          opacityConnectorTextSlider.value = connector.annotations[0].style.opacity * 100;
      }
    }
    
  }
  selectionChange(args) {
    if (args.state === 'Changed') {
      var selectedItems = diagram.ej2_instances[0].selectedItems.nodes;
      selectedItems = diagram.ej2_instances[0].selectedItems.nodes.concat(diagram.ej2_instances[0].selectedItems.connectors);
      enableToolbarItems(selectedItems);
      this.updateNodePropertiesInView(diagram.ej2_instances[0].selectedItems);
      const nodeContainer = document.getElementById('nodePropertyContainer');
      nodeContainer.classList.remove('multiple', 'connector');

      if (selectedItems.length > 1) {
        this.multipleSelectionSettings(selectedItems);
        toolbarEditor.ej2_instances[0].items[7].tooltipText = 'Group';
        toolbarEditor.ej2_instances[0].items[7].prefixIcon = 'sf-icon-group';

        for (let i = 7; i <= 28; i++) {
          toolbarEditor.ej2_instances[0].items[i].visible = true;
        }
      } else if (selectedItems.length === 1) {
        this.singleSelectionSettings(selectedItems[0]);
        for (let i = 7; i <= 28; i++) {
          if (i <= 16) {
            toolbarEditor.ej2_instances[0].items[i].visible = false;
          }
          else {
            toolbarEditor.ej2_instances[0].items[i].visible = true;
          }
        }
        if (selectedItems[0].children && selectedItems[0].children.length > 0) {
          toolbarEditor.ej2_instances[0].items[7].tooltipText = 'UnGroup';
          toolbarEditor.ej2_instances[0].items[7].prefixIcon = 'sf-icon-ungroup';
          toolbarEditor.ej2_instances[0].items[7].visible = true;
        }
        
      } else {
        this.objectTypeChange('diagram');
        for (let i = 7; i <= 28; i++) {
          toolbarEditor.ej2_instances[0].items[i].visible = false;
        }
      }
    }
  }

  positionChange(args) {
    if (diagram.ej2_instances[0].selectedItems.nodes.concat(diagram.ej2_instances[0].selectedItems.connectors).length === 1) {
      nodeProperties.m_offsetX = args.newValue.offsetX;
      nodeProperties.m_offsetY = args.newValue.offsetY;
      this.updateNodePropertiesInView(diagram.ej2_instances[0].selectedItems);
    }
  }

  sizeChange(args) {
    if (diagram.ej2_instances[0].selectedItems.nodes.concat(diagram.ej2_instances[0].selectedItems.connectors).length === 1) {
      nodeProperties.m_width = args.newValue.width;
      nodeProperties.m_height = args.newValue.height;
      nodeProperties.m_offsetX = args.newValue.offsetX;
      nodeProperties.m_offsetY = args.newValue.offsetY;
      this.updateNodePropertiesInView(diagram.ej2_instances[0].selectedItems);
    }
  }

  rotateChange(args) {
    if (args.state === 'Start' || args.state === 'Progress') {
      diagram.ej2_instances[0].selectedItems = { constraints: ej.diagrams.SelectorConstraints.None };
    }

    if (args.state === 'Completed') {
      diagram.ej2_instances[0].selectedItems = { constraints: ej.diagrams.SelectorConstraints.All | ej.diagrams.SelectorConstraints.UserHandle };
    }

    if (diagram.ej2_instances[0].selectedItems.nodes.concat(diagram.ej2_instances[0].selectedItems.connectors).length === 1) {
      nodeProperties.m_rotateAngle = args.newValue.rotateAngle;
    }
    this.updateNodePropertiesInView(diagram.ej2_instances[0].selectedItems);
  }

  historyChange(args) {
    const toolbarContainer = document.getElementsByClassName('db-toolbar-container')[0];
    toolbarContainer.classList.remove('db-undo', 'db-redo');

    if (diagram.ej2_instances[0].historyManager.undoStack.length > 0) {
      toolbarContainer.classList.add('db-undo');
    }

    if (diagram.ej2_instances[0].historyManager.redoStack.length > 0) {
      toolbarContainer.classList.add('db-redo');
    }
  }

  created(args) {
    diagram.ej2_instances[0].fitToPage({ mode: 'Page', region: 'Content' });
  }

  dragEnter(args) {
    if (args.element.id.indexOf('Doorclose') !== -1) {
      args.element.width = 40;
      args.element.height = 42;
    }
    else if (args.element.id.indexOf('Doubledoorclose') !== -1) {
      args.element.width = 80;
      args.element.height = 42;
    }
    else if (args.element.id.indexOf('CircleDiningTable') !== -1) {
      args.element.width = 50;
      args.element.height = 50;
    }
    else if (args.element.id.indexOf('CircleStudyTable') !== -1 || args.element.id.indexOf('CircleStudyTable1') !== -1 || args.element.id.indexOf('CircleStudyTable2') !== -1 || args.element.id.indexOf('CircleStudyTable3') !== -1) {
      args.element.width = 40;
      args.element.height = 40;
    }
    else if (args.element.id.indexOf('RectangleDiningTable') !== -1) {
      args.element.width = 50;
      args.element.height = 50;
    }
    else if (args.element.id.indexOf('OblongDiningTable') !== -1 || args.element.id.indexOf('OvalDiningTable') !== -1) {
      args.element.width = 90;
      args.element.height = 50;
    }
    else if (args.element.id.indexOf('RectangularTableforTwo') !== -1 || args.element.id.indexOf('CircularTableforTwo') !== -1) {
      args.element.width = 50;
      args.element.height = 60;
    }
    else if (args.element.id.indexOf('RectangleStudyTable') !== -1 || args.element.id.indexOf('RectangleStudyTable1') !== -1) {
      args.element.width = 80;
      args.element.height = 40;
    }
    else if (args.element.id.indexOf('Refrigerator') !== -1) {
      args.element.width = 52;
      args.element.height = 60;
    }
    else if (args.element.id.indexOf('Stool') !== -1) {
      args.element.width = 23;
      args.element.height = 23;
    }
    else if (args.element.id.indexOf('WallCorner') !== -1 || args.element.id.indexOf('WallCorner1') !== -1) {
      args.element.width = 50;
      args.element.height = 50;
    }
    else if (args.element.id.indexOf('WaterCooler') !== -1 || args.element.id.indexOf('Elevator') !== -1) {
      args.element.width = 40;
      args.element.height = 40;
    }
    else if (args.element.id.indexOf('Chair1') !== -1) {
      args.element.width = 25;
      args.element.height = 25;
    }
    else if (args.element.id.indexOf('Chair') !== -1 || args.element.id.indexOf('LargePlant') !== -1) {
      args.element.width = 28;
      args.element.height = 32;
    }
    else if (args.element.id.indexOf('Doublebed') !== -1 || args.element.id.indexOf('Doublebed1') !== -1) {
      args.element.width = 100;
      args.element.height = 90;
    }
    else if (args.element.id.indexOf('Singlebed') !== -1 || args.element.id.indexOf('Singlebed1') !== -1) {
      args.element.width = 50;
      args.element.height = 90;
    }
    else if (args.element.id.indexOf('BookCase') !== -1) {
      args.element.width = 60;
      args.element.height = 20;
    }
    else if (args.element.id.indexOf('Warddrobe') !== -1 || args.element.id.indexOf('Warddrobe1') !== -1) {
      args.element.width = 73;
      args.element.height = 35;
    }
    else if (args.element.id.indexOf('SmallPlant') !== -1 || args.element.id.indexOf('Lamplight') !== -1) {
      args.element.width = 25;
      args.element.height = 25;
    }
    else if (args.element.id.indexOf('Matte') !== -1 || args.element.id.indexOf('Matte1') !== -1) {
      args.element.width = 40;
      args.element.height = 20;
    }
    else if (args.element.id.indexOf('FlatTV') !== -1 || args.element.id.indexOf('FlatTV1') !== -1) {
      args.elementwidth = 68;
      args.element.height = 10;
    }
    else if (args.element.id.indexOf('TV') !== -1) {
      args.element.width = 40;
      args.element.height = 25;
    }
    else if (args.element.id.indexOf('SingleSofa') !== -1 || args.element.id.indexOf('Couch') !== -1) {
      args.element.width = 45;
      args.element.height = 40;
    }
    else if (args.element.id.indexOf('Sofa') !== -1 || args.element.id.indexOf('DoubleSofa') !== -1 || args.element.id.indexOf('Lounge') !== -1) {
      args.element.width = 100;
      args.element.height = 35;
    }
    else if (args.element.id.indexOf('WindowGarden') !== -1) {
      args.element.width = 80;
      args.element.height = 18;
    }
    else if (args.element.id.indexOf('SmallGasRange') !== -1) {
      args.element.width = 80;
      args.element.height = 32;
    }
    else if (args.element.id.indexOf('LargeGasRange') !== -1 || args.element.id.indexOf('LargeGasRange1') !== -1) {
      args.element.width = 100;
      args.element.height = 32;
    }
    else if (args.element.id.indexOf('Window') !== -1 || args.element.id.indexOf('window1') !== -1) {
      args.element.width = 50;
      args.element.height = 6;
    }

    else if (args.element.id.indexOf('Piano') !== -1) {
      args.element.width = 68;
      args.element.height = 71;
    }
    else if (args.element.id.indexOf('Staircase1') !== -1) {
      args.element.width = 150;
      args.element.height = 100;
    }
    else if (args.element.id.indexOf('Staircase') !== -1) {
      args.element.width = 150;
      args.element.height = 50;
    }
    else if (args.element.id.indexOf('Printer') !== -1 || args.element.id.indexOf('Laptop') !== -1) {
      args.element.width = 30;
      args.element.height = 30;
    }
    else if (args.element.id.indexOf('Room') !== -1 || args.element.id.indexOf('TRoom') !== -1 || args.element.id.indexOf('LRoom') !== -1 || args.element.id.indexOf('TWall') !== -1) {
      args.element.width = 50;
      args.element.height = 50;
    }
    else if (args.element.id.indexOf('DoubleSink') !== -1 || args.element.id.indexOf('DoubleSink1') !== -1 || args.element.id.indexOf('DoubleSink2') !== -1 || args.element.id.indexOf('DoubleSink4') !== -1) {
      args.element.width = 76;
      args.element.height = 38;
    }
    else if (args.element.id.indexOf('Toilet1') !== -1 || args.element.id.indexOf('Toilet2') !== -1) {
      args.element.width = 23;
      args.element.height = 36;
    }
    else if (args.element.id.indexOf('Corner Shower') !== -1 || args.element.id.indexOf('Shower') !== -1) {
      args.element.width = 50;
      args.element.height = 50;
    }
    else if (args.element.id.indexOf('WashBasin1') !== -1 || args.element.id.indexOf('WashBasin2') !== -1 || args.element.id.indexOf('WashBasin3') !== -1 || args.element.id.indexOf('WashBasin5') !== -1 || args.element.id.indexOf('WashBasin6') !== -1) {
      args.element.width = 35;
      args.element.height = 30;
    }
    else if (args.element.id.indexOf('BathTub') !== -1 || args.element.id.indexOf('BathTub1') !== -1 || args.element.id.indexOf('BathTub2') !== -1 || args.element.id.indexOf('BathTub3') !== -1) {
      args.element.width = 55;
      args.element.height = 30;
    }
    else {
      args.element.width = 50;
      args.element.height = 50;
    }
  }

  multipleSelectionSettings(selectedItems) {
    this.objectTypeChange('None');

    let showConnectorPanel = false, showNodePanel = false;
    let showTextPanel = false, showConTextPanel = false;
    const nodeContainer = document.getElementById('nodePropertyContainer');

    for (var i = 0; i < selectedItems.length; i++) {
      var object = selectedItems[i];
      if (object instanceof ej.diagrams.Node && (!showNodePanel || !showTextPanel)) {
        showNodePanel = true;
        showTextPanel = object.annotations.length > 0 && object.annotations[0].content ? true : false;
      }
      else if (object instanceof ej.diagrams.Connector && (!showConnectorPanel || !showConTextPanel)) {
        showConnectorPanel = true;
        showConTextPanel = object.annotations.length > 0 && object.annotations[0].content ? true : false;
      }
    }

    const selectItem1 = diagram.ej2_instances[0].selectedItems;

    if (showNodePanel) {
      nodeContainer.style.display = '';
      nodeContainer.classList.add('multiple');
      if (showConnectorPanel) {
        nodeContainer.classList.add('connector');
      }
      this.bindNodeProperties(selectItem1.nodes[0]);
    }

    if (showConnectorPanel && !showNodePanel) {
      document.getElementById('connectorPropertyContainer').style.display = '';
      this.bindConnectorProperties(selectItem1.connectors[0]);
    }

    if (showTextPanel || showConTextPanel) {
      document.getElementById('textPropertyContainer').style.display = '';
      if (showTextPanel && showConTextPanel) {
        document.getElementById('textPositionDiv').style.display = 'none';
        document.getElementById('textColorDiv').className = 'col-xs-6 db-col-left';
      } else {
        document.getElementById('textPositionDiv').style.display = '';
        document.getElementById('textColorDiv').className = 'col-xs-6 db-col-right';

        if (showConTextPanel) {
          ddlTextPosition.dataSource = TextProperties.prototype.getConnectorTextPositions();
        } else {
          ddlTextPosition.dataSource = TextProperties.prototype.getNodeTextPositions();
        }

        ddlTextPosition.ej2_instances[0].dataBind();
      }
    }
  }

  multipleSelection() {
    for (i = 8; i < 33; i++) {
      if (toolbarEditor.items[i].type !== 'Separator') {
        if (i !== 32 && i !== 33) {
          toolbarEditor.items[i].template = '';
        }
        if (i == 32 || i == 33) {
          toolbarEditor.items[i].template = '<div></div>';
        }
      }
    }
  }

  singleSelectionSettings(selectedObject) {
    var object = null;
    if (selectedObject instanceof ej.diagrams.Node) {
      this.objectTypeChange('node');
      object = selectedObject;
      this.bindNodeProperties(object);
    }
    else if (selectedObject instanceof ej.diagrams.Connector) {
      this.objectTypeChange('connector');
      object = selectedObject;
      this.bindConnectorProperties(object);
    }

    if (object.shape && object.shape.type === 'Text') {
      document.getElementById('textPropertyContainer').style.display = '';
      document.getElementById('toolbarTextAlignmentDiv').style.display = 'none';
      document.getElementById('textPositionDiv').style.display = 'none';
      document.getElementById('textColorDiv').className = 'col-xs-6 db-col-left';
      // Disable opacity slider and text input
      const opacitySlider = document.getElementById('textOpacityProperty');
      if (opacitySlider) {
        opacitySlider.style.visibility = 'hidden';
      }
      this.bindTextProperties(object.style);
    } else if (object.annotations.length > 0 && object.annotations[0].content) {
      document.getElementById('textPropertyContainer').style.display = '';
      var annotation = null;
      document.getElementById('toolbarTextAlignmentDiv').style.display = '';
      document.getElementById('textPositionDiv').style.display = '';
      document.getElementById('textColorDiv').className = 'col-xs-6 db-col-right';
      // Reset opacity controls for non-text nodes
      const opacitySlider = document.getElementById('textOpacityProperty');
      if (opacitySlider) {
          opacitySlider.style.visibility = 'visible';
      }
      this.bindTextProperties(object.annotations[0].style);
      UtilityMethods.prototype.updateHorVertAlign(object.annotations[0].horizontalAlignment, object.annotations[0].verticalAlignment);
      if (object.annotations[0] instanceof ej.diagrams.ShapeAnnotation) {
        annotation = object.annotations[0];
        ddlTextPosition.dataSource = TextProperties.prototype.getNodeTextPositions();
        ddlTextPosition.value = textProperties.textPosition = null;
        ddlTextPosition.ej2_instances[0].dataBind();
        ddlTextPosition.value = textProperties.textPosition = UtilityMethods.prototype.getPosition(annotation.offset);
        ddlTextPosition.ej2_instances[0].dataBind();
      }
      else if (object.annotations[0] instanceof ej.diagrams.PathAnnotation) {
        annotation = object.annotations[0];
        ddlTextPosition.dataSource = TextProperties.prototype.getConnectorTextPositions();
        ddlTextPosition.value = textProperties.textPosition = null;
        ddlTextPosition.ej2_instances[0].dataBind();
        ddlTextPosition.value = textProperties.textPosition = annotation.alignment;
        ddlTextPosition.ej2_instances[0].dataBind();
      }
    }
  }

  objectTypeChange(objectType) {
    document.getElementById('diagramPropertyContainer').style.display = 'none';
    document.getElementById('nodePropertyContainer').style.display = 'none';
    document.getElementById('textPropertyContainer').style.display = 'none';
    document.getElementById('connectorPropertyContainer').style.display = 'none';

    switch (objectType) {
      case 'diagram':
        document.getElementById('diagramPropertyContainer').style.display = '';
        break;
      case 'node':
        document.getElementById('nodePropertyContainer').style.display = '';
        break;
      case 'connector':
        document.getElementById('connectorPropertyContainer').style.display = '';
        break;
    }
  }

  bindNodeProperties(node) {
    nodeProperties.offsetX.value = node.offsetX;
    nodeProperties.offsetY.value = node.offsetY;
    nodeProperties.width.value = node.width;
    nodeProperties.height.value = node.height;
    nodeProperties.rotateAngle.value = node.rotateAngle;
    nodeProperties.fillColor.value = UtilityMethods.prototype.getHexColor(node.style.fill);
    nodeProperties.strokeColor.value = UtilityMethods.prototype.getHexColor(node.style.strokeColor);
    nodeProperties.strokeWidth.value = node.style.strokeWidth;
    nodeProperties.strokeStyle.value = node.style.strokeDashArray ? node.style.strokeDashArray : '';
    nodeProperties.aspectRatio.cssClass = node.constraints & ej.diagrams.NodeConstraints.AspectRatio ? document.getElementById('aspectRatioBtn').classList.add('e-active') : document.getElementById('aspectRatioBtn').classList.remove('e-active');
    node.constraints & ej.diagrams.NodeConstraints.AspectRatio ? aspectRatioBtn.ej2_instances[0].iconCss = 'sf-icon-lock': aspectRatioBtn.ej2_instances[0].iconCss = 'sf-icon-unlock';
  }

  bindConnectorProperties(connector) {
    ConnectorProperties.m_lineColor.value = UtilityMethods.prototype.getHexColor(connector.style.strokeColor);
    ConnectorProperties.lineWidth = connector.style.strokeWidth;
    ConnectorProperties.opacity = connector.style.opacity * 100;
  }

  bindTextProperties(text) {
    textProperties.fontColor.value = UtilityMethods.prototype.getHexColor(text.color);
    textProperties.fontFamily.value = text.fontFamily;
    textProperties.fontSize.value = text.fontSize;
    textProperties.opacity = text.opacity * 100;
    var toolbarTextStyle = document.getElementById('toolbarTextStyle');
    if (toolbarTextStyle) {
      toolbarTextStyle = toolbarTextStyle.ej2_instances[0];
    }
    if (toolbarTextStyle) {
      toolbarTextStyle.items[0].cssClass = text.bold ? 'tb-item-start tb-item-selected' : 'tb-item-start';
      toolbarTextStyle.items[1].cssClass = text.italic ? 'tb-item-middle tb-item-selected' : 'tb-item-middle';
      toolbarTextStyle.items[2].cssClass = text.textDecoration === 'Underline' ? 'tb-item-end tb-item-selected' : 'tb-item-end';
    }
    UtilityMethods.prototype.updateTextAlign(text.textAlign);
  }
}
module.exports = DiagramClientSideEvents;