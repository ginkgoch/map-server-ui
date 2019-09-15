import { uuid } from "../shared";

export class JsonTemplates {
    static getShapefileSource(name, filePath, srs) {
        const template = {
            "type": "shapefile-feature-source",
            "name": name,
            "projection": {
                "from": {
                    "projection": srs
                },
                "to": {
                    "unit": "unknown"
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
            "source": source
        }

        return template;
    }
}