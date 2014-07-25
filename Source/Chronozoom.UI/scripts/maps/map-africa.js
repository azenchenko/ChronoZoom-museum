var CZ;
(function (CZ) {
    var MapAfrica = (function () {
        var _this;

        function MapAfrica(mapDiv) {
            _this = this;

            this.base = CZ.Map;
            this.base(mapDiv);

            this.initialize("Africa");
        }
        MapAfrica.prototype = new CZ.Map();

        /**
         * Creates datepicker based on given JQuery instance of div
         */
        MapAfrica.prototype.initialize = function (mapType) {
            if (!CZ.Map.prototype.initialize.call(this, arguments[0])) {
                this.geoMapLayer = d3.select(this.mapDiv)
                    .select("g");

                return false;
            }

            var width = _this.$map.width(),
                height = _this.$map.height(),
                svg = d3.select(this.mapDiv)
                    .select("svg"),
                active = d3.select(null);

            this.geoMapLayer = d3.select(this.mapDiv)
                .select("g");

            d3.json("maps-topojson/africa.json", function (error, map) {
                if (error) {
                    return console.error(error);
                }

                // Initial projection.
                var projection = d3.geo.mercator()
                    .scale(1)
                    .translate([0, 0]);

                var path = d3.geo
                                .path()
                                .projection(projection);

                // Centerin map view.
                var b = path.bounds(topojson.feature(map, map.objects.africa_countries))
                s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
                t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

                projection
                    .scale(s)
                    .translate(t);

                var zoom = d3.behavior
                                .zoom()
                                .translate([0, 0])
                                .scale(1)
                                .scaleExtent([1, 40])
                                .on("zoom", onZoomed);

                svg.call(zoom) // delete this line to disable free zooming
                    .call(zoom.event);

                _this.geoMapLayer.selectAll(".subunit")
                                .data(topojson.feature(map, map.objects.africa_countries).features)
                                .enter().append("path")
                                .attr("class", function (d) {
                                    return "subunit " + d.properties.name;
                                }).attr("d", path)
                                .attr("data-id", function (d) {
                                    return d.id
                                })
                                .on("click", onClicked);

                _this.geoMapLayer.selectAll(".place-label")
                                .data(topojson.feature(map, map.objects.africa_countries).features)
                                .enter().append("text")
                                .attr("class", function (d) { return "subunit-label " + d.id; })
                                .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
                                .attr("dy", ".35em")
                                .text(function (d) { return d.properties.name; });

                _this.geoMapLayer.append("path")
                                .datum(topojson.mesh(map, map.objects.africa_countries, function (a, b) { return a !== b; }))
                                .attr("class", "subunit-boundary")
                                .attr("d", path);

                function onClicked(d) {
                    if (active.node() === this) return resetViewport();
                    
                    if (CZ.Authoring.isActive) {
                    _this.$map.trigger("mapareaclicked", {
                            mapAreaId: d.id
                        });
                    }
                    else {
                        active.classed("active", false);
                        active = d3.select(this).classed("active", true);

                        var bounds = path.bounds(d),
                            dx = bounds[1][0] - bounds[0][0],
                            dy = bounds[1][1] - bounds[0][1],
                            x = (bounds[0][0] + bounds[1][0]) / 2,
                            y = (bounds[0][1] + bounds[1][1]) / 2,
                            scale = .95 / Math.max(dx / width, dy / height),
                            translate = [width / 2 - scale * x, height / 2 - scale * y];

                        _this.geoMapLayer.transition()
                            .duration(750)
                            .style("stroke-width", 1.5 / scale + "px")
                            .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
                    }
                }

                function onZoomed() {
                    _this.geoMapLayer.style("stroke-width", 1.5 / d3.event.scale + "px");
                    _this.geoMapLayer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                    _this.geoMapLayer.selectAll(".subunit-label").style("font-size", 15 / d3.event.scale + "px");
                }

                // If the drag behavior prevents the default click,
                // also stop propagation so we don’t click-to-zoom.
                function stopped() {
                    if (d3.event.defaultPrevented) d3.event.stopPropagation();
                }

                function resetViewport() {
                    active.classed("active", false);
                    active = d3.select(null);

                    _this.geoMapLayer.transition()
                        .duration(750)
                        .call(zoom.translate([0, 0]).scale(1).event);
                }
            });
        };

        /**
         * Show map.
         */
        MapAfrica.prototype.show = function (args) {
            CZ.Map.prototype.show.call(this, args);
        };

        /**
         * Hide map.
         */
        MapAfrica.prototype.hide = function (args) {
            CZ.Map.prototype.hide.call(this, args);
        };

        return MapAfrica;
    })();

    CZ.MapAfrica = MapAfrica;
})(CZ || (CZ = {}));
