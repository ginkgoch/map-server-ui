export class GeomUtils {
    static isAreaGeometry(geomType) {
        const type = geomType ? geomType.toLowerCase() : 'unknown';
        return type === 'polygon' || type === 'multipolygon';
    }

    static isLineGeometry(geomType) {
        const type = geomType ? geomType.toLowerCase() : 'unknown';
        return type === 'linestring' || type === 'multilinestring';
    }

    static isPointGeometry(geomType) {
        const type = geomType ? geomType.toLowerCase() : 'unknown';
        return type === 'point' || type === 'multipoint';
    }
}