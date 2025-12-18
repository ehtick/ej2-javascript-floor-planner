class DropDownDataSources {
    constructor() {}

    paperList() {
        return [
            { text: 'Letter (8.5 in x 11 in)', value: 'Letter' },
            { text: 'Legal (8.5 in x 14 in)', value: 'Legal' },
            { text: 'Tabloid (279 mm x 432 mm)', value: 'Tabloid' },
            { text: 'A3 (297 mm x 420 mm)', value: 'A3' },
            { text: 'A4 (210 mm x 297 mm)', value: 'A4' },
            { text: 'A5 (148 mm x 210 mm)', value: 'A5' },
            { text: 'A6 (105 mm x 148 mm)', value: 'A6' },
            { text: 'Custom', value: 'Custom' },
        ];
    }

    fileFormats() {
        return [
            { text: 'JPG', value: 'JPG' },
            { text: 'PNG', value: 'PNG' },
            { text: 'SVG', value: 'SVG' }
        ];
    }

    diagramRegions() {
        return [
            { text: 'Content', value: 'Content' },
            { text: 'PageSettings', value: 'PageSettings' }
        ];
    }

    borderStyles() {
        return [
            { text: '', value: '', className: 'ddl-svg-style ddl_linestyle_none' },
            { text: '1,2', value: '1,2', className: 'ddl-svg-style ddl_linestyle_one_two' },
            { text: '3,3', value: '3,3', className: 'ddl-svg-style ddl_linestyle_three_three' },
            { text: '5,3', value: '5,3', className: 'ddl-svg-style ddl_linestyle_five_three' },
            { text: '4,4,1', value: '4,4,1', className: 'ddl-svg-style ddl_linestyle_four_four_one' }
        ];
    }

    fontFamilyList() {
        return [
            { text: 'Arial', value: 'Arial' },
            { text: 'Aharoni', value: 'Aharoni' },
            { text: 'Bell MT', value: 'Bell MT' },
            { text: 'Fantasy', value: 'Fantasy' },
            { text: 'Times New Roman', value: 'Times New Roman' },
            { text: 'Segoe UI', value: 'Segoe UI' },
            { text: 'Verdana', value: 'Verdana' },
        ];
    }

    textPositionDataSource() {
        return [
            { text: 'TopLeft', value: 'TopLeft' },
            { text: 'TopCenter', value: 'TopCenter' },
            { text: 'TopRight', value: 'TopRight' },
            { text: 'MiddleLeft', value: 'MiddleLeft' },
            { text: 'Center', value: 'Center' },
            { text: 'MiddleRight', value: 'MiddleRight' },
            { text: 'BottomLeft', value: 'BottomLeft' },
            { text: 'BottomCenter', value: 'BottomCenter' },
            { text: 'BottomRight', value: 'BottomRight' },
        ];
    }
}

// Export the class
module.exports = DropDownDataSources;