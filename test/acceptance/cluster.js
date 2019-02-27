'use strict';

require('../support/test_helper');

const assert = require('../support/assert');
const TestClient = require('../support/test-client');

const POINTS_SQL_1 = `
    select
        x + 4 as cartodb_id,
        st_setsrid(st_makepoint(x*10, x*10), 4326) as the_geom,
        st_transform(st_setsrid(st_makepoint(x*10, x*10), 4326), 3857) as the_geom_webmercator,
        x as value
    from generate_series(-3, 3) x
`;

const defaultLayers = [{
    type: 'cartodb',
    options: {
        sql: POINTS_SQL_1,
        aggregation: {
            threshold: 1
        }
    }
}];

function createVectorMapConfig (layers = defaultLayers) {
    return {
        version: '1.8.0',
        layers: layers
    };
}

describe('cluster', function () {
    describe('map-config w/o aggregation', function () {
        it('should return error while fetching disaggregated features', function (done) {
            const mapConfig = createVectorMapConfig([{
                type: 'cartodb',
                options: {
                    sql: POINTS_SQL_1,
                    cartocss: TestClient.CARTOCSS.POINTS,
                    cartocss_version: '2.3.0'
                }
            }]);
            const testClient = new TestClient(mapConfig);
            const zoom = 0;
            const cartodb_id = 1;
            const layerId = 0;
            const params = {
                response: {
                    status: 400
                }
            };

            testClient.getClusterFeatures(zoom, cartodb_id, layerId, params, (err, body) => {
                if (err) {
                    return done(err);
                }

                assert.deepStrictEqual(body, {
                    errors:[ 'Map d725a568ab961af8197d311eececb83a has no aggregation defined for layer 0' ],
                    errors_with_context:[
                        {
                            type: 'unknown',
                            message: 'Map d725a568ab961af8197d311eececb83a has no aggregation defined for layer 0'
                        }
                    ]
                });
                testClient.drain(done);
            });
        });
    });

    describe('map-config with aggregation', function () {
        const suite = [
            {
                zoom: 0,
                cartodb_id: 1,
                resolution: 0.5,
                expected: [ { cartodb_id: 1, value: -3 } ]
            },
            {
                zoom: 0,
                cartodb_id: 2,
                resolution: 0.5,
                expected: [ { cartodb_id: 2, value: -2 } ]
            },
            {
                zoom: 0,
                cartodb_id: 3,
                resolution: 0.5,
                expected: [ { cartodb_id: 3, value: -1 } ]
            },
            {
                zoom: 0,
                cartodb_id: 4,
                resolution: 0.5,
                expected: [ { cartodb_id: 4, value: 0 } ]
            },
            {
                zoom: 0,
                cartodb_id: 5,
                resolution: 0.5,
                expected: [ { cartodb_id: 5, value: 1 } ]
            },
            {
                zoom: 0,
                cartodb_id: 6,
                resolution: 0.5,
                expected: [ { cartodb_id: 6, value: 2 } ]
            },
            {
                zoom: 0,
                cartodb_id: 7,
                resolution: 0.5,
                expected: [ { cartodb_id: 7, value: 3 } ]
            },
            {
                zoom: 0,
                cartodb_id: 1,
                resolution: 1,
                expected: [ { cartodb_id: 1, value: -3 } ]
            },
            {
                zoom: 0,
                cartodb_id: 2,
                resolution: 1,
                expected: [ { cartodb_id: 2, value: -2 } ]
            },
            {
                zoom: 0,
                cartodb_id: 3,
                resolution: 1,
                expected: [ { cartodb_id: 3, value: -1 } ]
            },
            {
                zoom: 0,
                cartodb_id: 4,
                resolution: 1,
                expected: [ { cartodb_id: 4, value: 0 } ]
            },
            {
                zoom: 0,
                cartodb_id: 5,
                resolution: 1,
                expected: [ { cartodb_id: 5, value: 1 } ]
            },
            {
                zoom: 0,
                cartodb_id: 6,
                resolution: 1,
                expected: [ { cartodb_id: 6, value: 2 } ]
            },
            {
                zoom: 0,
                cartodb_id: 7,
                resolution: 1,
                expected: [ { cartodb_id: 7, value: 3 } ]
            },
            {
                zoom: 0,
                cartodb_id: 1,
                resolution: 50,
                expected: [
                    { cartodb_id: 1, value: -3 },
                    { cartodb_id: 2, value: -2 },
                    { cartodb_id: 3, value: -1 },
                    { cartodb_id: 4, value: 0 },
                ]
            },
            {
                zoom: 0,
                cartodb_id: 5,
                resolution: 50,
                expected: [
                    { cartodb_id: 5, value: 1 },
                    { cartodb_id: 6, value: 2 },
                    { cartodb_id: 7, value: 3 }
                ]
            },
            {
                zoom: 1,
                cartodb_id: 1,
                resolution: 1,
                expected: [ { cartodb_id: 1, value: -3 } ]
            },
            {
                zoom: 1,
                cartodb_id: 2,
                resolution: 1,
                expected: [ { cartodb_id: 2, value: -2 } ]
            },
            {
                zoom: 1,
                cartodb_id: 3,
                resolution: 1,
                expected: [ { cartodb_id: 3, value: -1 } ]
            },
            {
                zoom: 1,
                cartodb_id: 4,
                resolution: 1,
                expected: [ { cartodb_id: 4, value: 0 } ]
            },
            {
                zoom: 1,
                cartodb_id: 5,
                resolution: 1,
                expected: [ { cartodb_id: 5, value: 1 } ]
            },
            {
                zoom: 1,
                cartodb_id: 6,
                resolution: 1,
                expected: [ { cartodb_id: 6, value: 2 } ]
            },
            {
                zoom: 1,
                cartodb_id: 7,
                resolution: 1,
                expected: [ { cartodb_id: 7, value: 3 } ]
            },
            {
                zoom: 1,
                cartodb_id: 1,
                resolution: 50,
                expected: [
                    { cartodb_id: 1, value: -3 },
                    { cartodb_id: 2, value: -2 },
                    { cartodb_id: 3, value: -1 },
                    { cartodb_id: 4, value: 0 },
                ]
            },
            {
                zoom: 1,
                cartodb_id: 5,
                resolution: 50,
                expected: [
                    { cartodb_id: 5, value: 1 },
                    { cartodb_id: 6, value: 2 },
                    { cartodb_id: 7, value: 3 }
                ]
            }
        ];

        suite.forEach(({ zoom, cartodb_id, resolution, expected }) => {
            const description = `should get features for z: ${zoom} cartodb_id: ${cartodb_id}, res: ${resolution}`;
            it(description, function (done) {
                const mapConfig = createVectorMapConfig([{
                    type: 'cartodb',
                    options: {
                        sql: POINTS_SQL_1,
                        aggregation: {
                            threshold: 1,
                            resolution: resolution
                        }
                    }
                }]);
                const testClient = new TestClient(mapConfig);
                const layerId = 0;
                const params = {};

                testClient.getClusterFeatures(zoom, cartodb_id, layerId, params, (err, body) => {
                    if (err) {
                        return done(err);
                    }

                    assert.deepStrictEqual(body.rows, expected);
                    testClient.drain(done);
                });
            });
        });
    });
});
