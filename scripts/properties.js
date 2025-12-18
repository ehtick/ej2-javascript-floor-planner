var UtilityMethods = require("./utilitymethods.js")
const {
  
  ConnectorProperties,
  TextProperties,
} = require('./common');

var utilitymethods = new UtilityMethods();
var textProperties = new TextProperties();

class PropertyChange {
    constructor() {
      this.isModified = false;
    }
  
    nodePropertyChange(args) {
      if (diagram) {
        if (diagram.ej2_instances[0].selectedItems.nodes.length > 0) {
          const selectedNodes = diagram.ej2_instances[0].selectedItems.nodes;
          for (let i = 0; i < selectedNodes.length; i++) {
            const node = selectedNodes[i];
            const propertyName1 = args.propertyName.toString().toLowerCase();
            switch (propertyName1) {
              case 'offsetx':
                node.offsetX = args.propertyValue.value;
                break;
              case 'offsety':
                node.offsetY = args.propertyValue.value;
                break;
              case 'width':
                node.width = args.propertyValue.value;
                break;
              case 'height':
                node.height = args.propertyValue.value;
                break;
              case 'rotateangle':
                if (args.propertyValue.previousValue !== null) {
                  node.rotateAngle = args.propertyValue.value;
                }
                break;
              case 'aspectratio':
                node.constraints = node.constraints ^ ej.diagrams.NodeConstraints.AspectRatio;
                break;
            }
            if (!node.children) {
              utilitymethods.applyNodeStyle(propertyName1, node, args.propertyValue);
            } else {
              for (let j = 0; j < node.children.length; j++) {
                utilitymethods.applyNodeStyle(propertyName1, diagram.ej2_instances[0].getObject(node.children[j]), args.propertyValue);
              }
            }
          }
          this.isModified = true;
        }
        if (diagram.ej2_instances[0].selectedItems.connectors.length > 0) {
          const selectedNodes = diagram.ej2_instances[0].selectedItems.connectors;
          for (let i = 0; i < selectedNodes.length; i++) {
            const connector = selectedNodes[i];
            switch (args.propertyName.toString().toLowerCase()) {
              case 'strokecolor':
                connector.style.strokeColor = utilitymethods.getColor(args.propertyValue.value);
                connector.sourceDecorator.style = { fill: connector.style.strokeColor, strokeColor: connector.style.strokeColor };
                connector.targetDecorator.style = { fill: connector.style.strokeColor, strokeColor: connector.style.strokeColor };
                break;
              case 'strokewidth':
                if (args.propertyValue.previousValue !== null) {
                  connector.style.strokeWidth = args.propertyValue.value;
                  connector.sourceDecorator.style = connector.sourceDecorator.style || { strokeWidth: connector.style.strokeWidth };
                  connector.targetDecorator.style = connector.targetDecorator.style || { strokeWidth: connector.style.strokeWidth };
                }
                break;
              case 'opacity':
                connector.style.opacity = args.propertyValue.value / 100;
                connector.targetDecorator.style.opacity = connector.style.opacity;
                connector.sourceDecorator.style.opacity = connector.style.opacity;
                document.getElementById("connectorOpacitySliderText").value = args.propertyValue.value + '%';
                break;
            }
          }
          this.isModified = true;
        }
        diagram.ej2_instances[0].selectedItems.dataBind();
      }
    }
  
    connectorPropertyChange(args) {
      if (diagram && diagram.ej2_instances[0].selectedItems.connectors.length > 0) {
        const selectedNodes = diagram.ej2_instances[0].selectedItems.connectors;
        for (let i = 0; i < selectedNodes.length; i++) {
          const connector = selectedNodes[i];
          
          switch (args.propertyName.toString().toLowerCase()) {
            case 'linecolor':
              connector.style.strokeColor = utilitymethods.getColor(ConnectorProperties.m_lineColor.value);
              connector.sourceDecorator.style = { fill: connector.style.strokeColor, strokeColor: connector.style.strokeColor };
              connector.targetDecorator.style = { fill: connector.style.strokeColor, strokeColor: connector.style.strokeColor };
              break;
            case 'linewidth':
              connector.style.strokeWidth = args.propertyValue.value;
              connector.sourceDecorator.style = connector.sourceDecorator.style || { strokeWidth: connector.style.strokeWidth };
              connector.targetDecorator.style = connector.targetDecorator.style || { strokeWidth: connector.style.strokeWidth };
              break;
            case 'linestyle':
              connector.style.strokeDashArray = ConnectorProperties.lineStyle.value;
              break;
            case 'linetype':
              connector.type = ConnectorProperties.lineType.value;
              break;
            case 'sourcetype':
              connector.sourceDecorator.shape = ConnectorProperties.sourceType.value;
              break;
            case 'targettype':
              connector.targetDecorator.shape = ConnectorProperties.targetType.value;
              break;
            case 'sourcesize':
              connector.sourceDecorator.width = connector.sourceDecorator.height = ConnectorProperties.sourceSize.value;
              break;
            case 'targetsize':
              connector.targetDecorator.width = connector.targetDecorator.height = ConnectorProperties.targetSize.value;
              break;
            case 'opacity':
              connector.style.opacity = args.propertyValue.value / 100;
              connector.targetDecorator.style.opacity = connector.style.opacity;
              connector.sourceDecorator.style.opacity = connector.style.opacity;
              document.getElementById("connectorOpacitySliderText").value = args.propertyValue.value  + '%';
              break;
            case 'linejump':
              connector.constraints = args.propertyValue.checked
                ? (connector.constraints | ej.diagrams.ConnectorConstraints.Bridging)
                : (connector.constraints & ~ej.diagrams.ConnectorConstraints.Bridging);
              break;
            case 'linejumpsize':
              connector.bridgeSpace = ConnectorProperties.lineJumpSize.value;
              break;
          }
        }
        diagram.ej2_instances[0].selectedItems.dataBind();
        this.isModified = true;
      }
    }
  
    textPropertyChange(args) {
      if (diagram) {
        let selectedObjects = diagram.ej2_instances[0].selectedItems.nodes.concat(diagram.ej2_instances[0].selectedItems.connectors);
        const propertyName = args.propertyName.toString().toLowerCase();
        
        if (selectedObjects.length > 0) {
          for (let i = 0; i < selectedObjects.length; i++) {
            const node = selectedObjects[i];
            
            if (node instanceof ej.diagrams.Node || node instanceof ej.diagrams.Connector) {
              if (node.annotations.length > 0) {
                for (let j = 0; j < node.annotations.length; j++) {
                  const annotation = node.annotations[j].style;
                  utilitymethods.updateTextFontProperties(propertyName, annotation, args);
                }
              } else if (node.shape && node.shape.type === 'Text') {
                utilitymethods.updateTextFontProperties(propertyName, node.style, args);
              }
            }
          }
          diagram.ej2_instances[0].selectedItems.dataBind();
          this.isModified = true;
        }
      }
    }
  
    textPropertiesChange(propertyName, propertyValue) {
      let selectedObjects = diagram.ej2_instances[0].selectedItems.nodes.concat(diagram.ej2_instances[0].selectedItems.connectors);
      propertyName = propertyName.toLowerCase();
      
      if (selectedObjects.length > 0) {
        for (let i = 0; i < selectedObjects.length; i++) {
          const node = selectedObjects[i];
          
          if (node instanceof ej.diagrams.Node || node instanceof ej.diagrams.Connector) {
            if (node.annotations.length > 0) {
              for (let j = 0; j < node.annotations.length; j++) {
                let annotation = null;
                
                if (node.annotations[j] instanceof ej.diagrams.ShapeAnnotation) {
                  annotation = node.annotations[j];
                  if (propertyName === 'textposition') {
                    textProperties.textPosition = propertyValue.toString();
                    annotation.offset = utilitymethods.getOffset(propertyValue);
                  }
                } else if (node.annotations[j] instanceof ej.diagrams.PathAnnotation) {
                  annotation = node.annotations[j];
                  if (propertyName === 'textposition') {
                    textProperties.textPosition = propertyValue.toString();
                    annotation.alignment = textProperties.textPosition;
                  }
                }
                
                if (['left', 'right', 'center'].includes(propertyName)) {
                  annotation.horizontalAlignment = propertyValue;
                  utilitymethods.updateHorVertAlign(annotation.horizontalAlignment, annotation.verticalAlignment);
                } else if (['top', 'bottom'].includes(propertyName)) {
                  annotation.verticalAlignment = propertyValue;
                  utilitymethods.updateHorVertAlign(annotation.horizontalAlignment, annotation.verticalAlignment);
                } else if (propertyName === 'middle') {
                  annotation.verticalAlignment = 'Center';
                  utilitymethods.updateHorVertAlign(annotation.horizontalAlignment, annotation.verticalAlignment);
                } else {
                  utilitymethods.updateTextProperties1(propertyName, propertyValue, annotation.style);
                }
              }
            } else if (node.shape && node.shape.type === 'Text') {
              utilitymethods.updateTextProperties1(propertyName, propertyValue, node.style);
            }
          }
        }
        diagram.ej2_instances[0].dataBind();
      }
    }
    aspectRatioClick() {
      var isAspect = true;
      if (document.getElementById('aspectRatioBtn').classList.contains('e-active')) {
          isAspect = true;
          aspectRatioBtn.ej2_instances[0].iconCss = 'sf-icon-lock'
      } else {
          isAspect = false;
          aspectRatioBtn.ej2_instances[0].iconCss = 'sf-icon-unlock';
      }
    this.nodePropertyChange({ propertyName: 'aspectRatio', propertyValue: isAspect });
    }
  }
  module.exports = PropertyChange;