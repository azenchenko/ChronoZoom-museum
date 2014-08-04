var CZ;
(function (CZ) {
    (function (Map) {
        var _this,
            projection,
            path;

        Map.prototype.MapAfrica = function (mapData, timeline) {
            _this = this;

            this.width = _this.$map.width();
            this.height = _this.$map.height();
            this.svg = d3.select(this.mapDiv)
                    .select("svg");
            this.active = d3.select(null);

            // if (this.mapType === "Africa") {
            //     return this;
            // }

            this.clearMap();
            // this.mapType = "Africa";

            this.mapData = mapData || [];

            this.$title.text(timeline.title);
            this.$start.text(CZ.Dates.convertCoordinateToYear(timeline.x).year + " " + CZ.Dates.convertCoordinateToYear(timeline.x).regime);

            if (timeline.endDate === 9999) {
                this.$end.text("Present");
            }
            else {
                this.$end.text(CZ.Dates.convertCoordinateToYear(timeline.endDate).year + " " + CZ.Dates.convertCoordinateToYear(timeline.endDate).regime);
            }

            loadData(this.mapData);

            this._ids = [];

            return this;
        };

        function loadData (mapData) {
            d3.json("maps-topojson/africa.json", function (error, map) {
                if (error) {
                    return console.error(error);
                }

                // Initial projection.
                projection = d3.geo.mercator()
                    .scale(1)
                    .translate([0, 0]);

                path = d3.geo
                    .path()
                    .projection(projection);

                // Centerin map view.
                var b = path.bounds(topojson.feature(map, map.objects.africa_countries))
                s = .95 / Math.max((b[1][0] - b[0][0]) / _this.width, (b[1][1] - b[0][1]) / _this.height),
                t = [(_this.width - s * (b[1][0] + b[0][0])) / 2, (_this.height - s * (b[1][1] + b[0][1])) / 2];

                projection
                    .scale(s)
                    .translate(t);

                var zoom = d3.behavior
                    .zoom()
                    .translate([0, 0])
                    .scale(1)
                    .scaleExtent([1, 40])
                    .on("zoom", onZoomed);

                _this.svg.call(zoom) // delete this line to disable free zooming
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

                _this.geoMapLayer.selectAll(".subunit")[0].forEach(function (item) {
                    _this._ids.push($(item).attr("data-id"));
                });

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

                var template = $("#MapTooltipExhibitTemplate .tooltip-exhibit-container");

                var _aids = [];

                mapData.forEach(function (item) {
                    if (item.mapAreaId && _aids.indexOf(item.mapAreaId === -1)) {
                        _aids.push(item.mapAreaId);
                    }
                });

                var $con = $("<div></div>");

                _aids.forEach(function (_item) {
                    $con = $("<div></div>");

                    mapData.filter(function (__item) {
                        return __item.mapAreaId === _item && __item.mapAreaId;
                    }).forEach(function (item) {
                        var it = template.clone(true, true);
                        it.attr("data-description", item.infodotDescription.title);
                        it.attr("data-date", CZ.Dates.convertCoordinateToYear(item.infodotDescription.date).year + " " + CZ.Dates.convertCoordinateToYear(item.infodotDescription.date).regime);
                        it.find("img").attr("src", item.contentItems[0].uri);

                        it.on("click", {
                            id: item.mapAreaId,
                            info: item.contentItems,
                            title: item.infodotDescription.title + " (" + CZ.Dates.convertCoordinateToYear(item.infodotDescription.date).year +
                                " " + CZ.Dates.convertCoordinateToYear(item.infodotDescription.date).regime + ")"
                        }, CZ.Common.map.showMapAreaInfo);

                        it.appendTo($con);
                    });

                    var cl = $(".subunit[data-id='" + _item + "']").attr("class");
                    $(".subunit[data-id='" + _item + "']").attr("class", cl +" selected");

                    $(_this.geoMapLayer.select(".subunit[data-id='" + _item + "']")).tooltipster({
                            content: $con,
                            interactive: true
                        })
                        .addClass("selected");
                    });
                });

                
                // $(_this.geoMapLayer.select(".subunit[data-id='" + item.mapAreaId + "']")).tooltipster({
                //     content: $con,
                //     interactive: true});
                // _this.loadData(mapData);
            // });
        }

        function onClicked(d) {
            if (_this.active.node() === _this) return resetViewport();
            
            if (CZ.Authoring.isActive) {
            _this.$map.trigger("mapareaclicked", {
                    mapAreaId: d.id
                });
            }
            else {
                _this.active.classed("active", false);
                _this.active = d3.select(this).classed("active", true);

                var bounds = path.bounds(d),
                    dx = bounds[1][0] - bounds[0][0],
                    dy = bounds[1][1] - bounds[0][1],
                    x = (bounds[0][0] + bounds[1][0]) / 2,
                    y = (bounds[0][1] + bounds[1][1]) / 2,
                    scale = .95 / Math.max(dx / _this.width, dy / _this.height),
                    translate = [_this.width / 2 - scale * x, _this.height / 2 - scale * y];

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
            _this.active.classed("active", false);
            _this.active = d3.select(null);

            _this.geoMapLayer.transition()
                .duration(750)
                .call(zoom.translate([0, 0]).scale(1).event);
        }
    })(CZ.Map || (CZ.Map = new function () {}));
})(CZ || (CZ = {}));
