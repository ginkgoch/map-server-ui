import { uuid } from "../shared";

export class LayerTemplates {
    static getFeatureSource(sourceType, name, path, fromSrs, toSrs) {
        switch (sourceType.toUpperCase()) {
            case 'SHAPEFILE':
                return this.getShapefileSource(name, path, fromSrs, toSrs);
            default:
                throw new Error(`Unsupported data source '${sourceType}'.`);
        }
    }

    static getShapefileSource(name, filePath, fromSrs, toSrs) {
        const template = {
            "type": "shapefile-feature-source",
            "name": name,
            "projection": {
                "from": {
                    "projection": fromSrs
                },
                "to": {
                    "projection": toSrs
                }
            },
            "flag": "rs",
            "filePath": filePath
        }

        return template;
    }

    static getFeatureLayer(name, source) {
        const template = {
            "type": "feature-layer",
            "id": `layer-${uuid()}`,
            "name": name,
            "source": source,
            "styles": []
        }

        return template;
    }

    static getGroup(name = 'Default') {
        return {
            "type": "layer-group",
            "name": name,
            "visible": true,
            "layers": []
        };
    } 
    
    static getFeatureCollection(features = []) {
        return {
            "type": "FeatureCollection",
            "features": features
        };
    }

    static getFeaturePopupContent(feature) {
        if (feature.properties) {
            return `<table class="popup-content">
                ${ Object.keys(feature.properties).map(k => `<tr><td class="title">${k}</td><td>${feature.properties[k]}</td></tr>`).join('') }
            </table>`;
        }
        else {
            return 'No Content...';
        }
    }
}