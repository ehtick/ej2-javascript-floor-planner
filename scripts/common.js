
class NodeProperties {
  constructor() {
    if (!NodeProperties.instance) {
    this.m_offsetX = 0;
    this.m_offsetY = 0;
    this.m_width = 0;
    this.m_height = 0;
    this.m_rotateAngle = 0;
    this.m_fillColor = '#ffffff';
    this.m_strokeColor = '#000000';
    this.m_strokeStyle = 'None';
    this.m_strokeWidth = 1;
    this.m_opacity = 0;
    this.opacityText = '0%';
    this.m_aspectRatio = false;
    this.m_gradient = false;
    this.m_gradientDirection = 'BottomToTop';
    this.m_gradientColor = '#ffffff';
    NodeProperties.instance = this;
  }
  return NodeProperties.instance;
}

  getGradient(node) {
    const nodeProperties = require('./common.js');
    const gradientValue = this.getGradientDirectionValue(nodeProperties.gradientDirection.value);
    node.style.gradient = {
      type: 'Linear',
      x1: gradientValue.x1, x2: gradientValue.x2, y1: gradientValue.y1, y2: gradientValue.y2,
      stops: [
        { color: node.style.fill, offset: 0 },
        { color: this.getColor(nodeProperties.gradientColor.value), offset: 1 }
      ]
    };
  }

  getGradientDirectionValue(direction) {
    let gradientValue = {};
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    if (direction === 'LeftToRight') {
      x1 = 100;
    } else if (direction === 'BottomToTop') {
      y2 = 100;
    } else if (direction === 'RightToLeft') {
      x2 = 100;
    } else {
      y1 = 100;
    }
    gradientValue = { x1: x1, y1: y1, x2: x2, y2: y2 };
    return gradientValue;
  }

  getColor(colorName) {
    if (window.navigator.msSaveBlob && colorName.length === 9) {
      return colorName.substring(0, 7);
    }
    return colorName;
  }
}


class ConnectorProperties {
  constructor() {
    this.m_lineColor = '#ffffff';
    this.m_opacity = 0;
  }
 
}


class TextProperties {
  constructor() {
    if (!TextProperties.instance) {
      this.textPosition = '';
      this.fontFamily = 'Arial';
      this.fontColor = '#ffffff';
      this.fontSize = 0;
      this.opacity = 0;
      this.textPositionDataSource = this.getNodeTextPositions();
      TextProperties.instance = this;
  }
  return TextProperties.instance;
}

  getNodeTextPositions() {
    return [
      { text: 'TopLeft', value: 'TopLeft' }, { text: 'TopCenter', value: 'TopCenter' },
      { text: 'TopRight', value: 'TopRight' }, { text: 'MiddleLeft', value: 'MiddleLeft' },
      { text: 'Center', value: 'Center' }, { text: 'MiddleRight', value: 'MiddleRight' },
      { text: 'BottomLeft', value: 'BottomLeft' }, { text: 'BottomCenter', value: 'BottomCenter' },
      { text: 'BottomRight', value: 'BottomRight' },
    ];
  }

  getConnectorTextPositions() {
    return [
      { text: 'Before', value: 'Before' }, { text: 'Center', value: 'Center' },
      { text: 'After', value: 'After' },
    ];
  }

  triggerPropertyChange(propertyName, propertyValue) {
    if (!ej.base.isNullOrUndefined(this.propertyChange)) {
      this.propertyChange.call(this, { propertyName: propertyName, propertyValue: propertyValue });
    }
  }
}


class ExportSettings {
  constructor() {
    this.m_fileName = 'Diagram';
    this.m_format = 'JPG';
    this.m_region = 'Content';
  }

  get fileName() {
    return this.m_fileName;
  }

  set fileName(fileName) {
    this.m_fileName = fileName;
  }

  get format() {
    return this.m_format;
  }

  set format(format) {
    this.m_format = format;
  }

  get region() {
    return this.m_region;
  }

  set region(region) {
    this.m_region = region;
  }
}


class PrintSettings {
  constructor() {
    this.m_region = 'Content';
    this.m_pageWidth = 0;
    this.m_pageHeight = 0;
    this.m_isPortrait = true;
    this.m_isLandscape = false;
    this.m_multiplePage = false;
    this.m_paperSize = 'Letter';
  }

  get region() {
    return this.m_region;
  }

  set region(region) {
    this.m_region = region;
  }

  get pageWidth() {
    return this.m_pageWidth;
  }

  set pageWidth(pageWidth) {
    this.m_pageWidth = pageWidth;
  }

  get pageHeight() {
    return this.m_pageHeight;
  }

  set pageHeight(pageHeight) {
    this.m_pageHeight = pageHeight;
  }

  get isPortrait() {
    return this.m_isPortrait;
  }

  set isPortrait(isPortrait) {
    this.m_isPortrait = isPortrait;
  }

  get isLandscape() {
    return this.m_isLandscape;
  }

  set isLandscape(isLandscape) {
    this.m_isLandscape = isLandscape;
  }

  get multiplePage() {
    return this.m_multiplePage;
  }

  set multiplePage(multiplePage) {
    this.m_multiplePage = multiplePage;
  }

  get paperSize() {
    return this.m_paperSize;
  }

  set paperSize(paperSize) {
    this.m_paperSize = paperSize;
    document.getElementById('printCustomSize').style.display = 'none';
    document.getElementById('printOrientation').style.display = 'none';
    if (paperSize === 'Custom') {
      document.getElementById('printCustomSize').style.display = '';
    } else {
      document.getElementById('printOrientation').style.display = '';
    }
  }
}

class PageSettings {
  constructor() {
      this.pageWidth = 1100;
      this.pageHeight = 820;
      this.backgroundColor = '#ffffff';
      this.isPortrait = false;
      this.isLandscape = true;
      this.paperSize = 'Letter';
      this.pageBreaks = false;
      this.showPageBreaks = undefined;
  }
}

function enableToolbarItems(selectedItems) {
  var toolbarContainer = document.getElementsByClassName('db-toolbar-container')[0];
  var toolbarClassName = 'db-toolbar-container';
  if (toolbarContainer.classList.contains('db-undo')) {
      toolbarClassName += ' db-undo';
  }
  if (toolbarContainer.classList.contains('db-redo')) {
      toolbarClassName += ' db-redo';
  }
  toolbarContainer.className = toolbarClassName;
  if (selectedItems.length === 1) {
      toolbarContainer.className = toolbarContainer.className + ' db-select';
      if (selectedItems[0] instanceof ej.diagrams.Node) {
          if (selectedItems[0].children) {
              if (selectedItems[0].children.length > 2) {
                  toolbarContainer.className = toolbarContainer.className + ' db-select db-double db-multiple db-node db-group';
              }
              else {
                  toolbarContainer.className = toolbarContainer.className + ' db-select db-double db-node db-group';
              }
          }
          else {
              toolbarContainer.className = toolbarContainer.className + ' db-select db-node';
          }
      }
  }
  else if (selectedItems.length === 2) {
      toolbarContainer.className = toolbarContainer.className + ' db-select db-double';
  }
  else if (selectedItems.length > 2) {
      toolbarContainer.className = toolbarContainer.className + ' db-select db-double db-multiple';
  }
  if (selectedItems.length > 1) {
      var isNodeExist = false;
      for (var i = 0; i < selectedItems.length; i++) {
          if (selectedItems[i] instanceof ej.diagrams.Node) {
              toolbarContainer.className = toolbarContainer.className + ' db-select db-node';
              break;
          }
      }
  }
};
module.exports = {
  NodeProperties,
  ConnectorProperties,
  TextProperties,
  ExportSettings,
  PrintSettings,
  PageSettings,
  enableToolbarItems
};



 