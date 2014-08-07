var CZ;
(function (CZ) {
    var Map = (function () {
        var _opts = {
            closeBtnClass: "map-close-btn",
            titleClass: "map-title",
            dateClassStart: "map-start-date",
            dateClassEnd: "map-end-date"
        };

        var _this;

        function Map(mapDiv) {
            this.mapDiv = mapDiv;
            this.map = null;
            this.$map = null;
            this.geoMapLayer;
            this.$closeBtn = null;
            this.mapType = null;
            this.mapData = [];
            this.$infoPanel = null;
            this.$contentContainer = null;
            this.$header = null;
            this.$infoCloseBtn = null;
            this.$title = null;
            this.$start = null;
            this.$end = null;
        }

        /**
         * Creates datepicker based on given JQuery instance of div
         */
        Map.prototype.init = function () {
            _this = this;

            this.map = d3.select(this.mapDiv);
            this.$map = $(this.map[0]);

            this.$closeBtn = $("<div></div>", {
                class: _opts.closeBtnClass,
                title: "Close the map view"
            });

            this.$closeBtn.appendTo(this.$map)
                .on("click", this, onCloseBtnClick);

            this.$title = $("<div></div>", {
                class: _opts.titleClass
            });

            this.$start = $("<div></div>", {
                class: _opts.dateClassStart
            });

            this.$end = $("<div></div>", {
                class: _opts.dateClassEnd
            });

            this.$title.appendTo(this.$map);
            this.$start.appendTo(this.$map);
            this.$end.appendTo(this.$map);

            svg = this.map.append("svg");
            this.geoMapLayer = svg.append("g")
                .style("stroke-width", "1.5px");

            this.$infoPanel = this.$map.find("#mapAreaInfo");

            this.initInfoPanel();
        };

        /**
         * Show map.
         */
        Map.prototype.show = function (args) {
            this.$map.show();
        };

        /**
         * Hide map.
         */
        Map.prototype.hide = function (args) {
            this.$map.hide();
        };

        /**
         * Removes map object.
         */
        Map.prototype.destroy = function () {
            d3.select(this.mapDiv)
                .select("svg")
                .remove();

            this.$map.removeAttr("data-map-type");
            this.$closeBtn.remove();
            this.mapType = null;
        };

        /**
         * Clears map paths.
         */
        Map.prototype.clearMap = function () {
            $(this.geoMapLayer[0]).empty()
                .off();
            this.mapType = null;
        };

        /**
         * Shows a placeholder for info related to area with given id.
         */
        Map.prototype.showMapAreaInfo = function (event) {
            var id = event.data.id;
            var info = event.data.info;

            _this.$infoPanel.show();
            _this.$contentContainer.empty();
            _this.$header.text(event.data.title);

            // it.contentItems.forEach(function (item) {
            info.forEach(function (item) {
                var $container = $("<div></div>", {
                    class: "map-view-exhibit-info"
                });

                var media;

                switch (item.mediaType) {
                    case "Picture":
                        media = $("<img></img>");
                        break;
                    default:
                        media = $("<iframe></iframe>");
                };

                media.css("float", "left")
                    .attr("src", item.uri);

                var des = $("<div></div>", {
                    text: item.description,
                    class: "map-view-exhibit-info-description"
                });

                $container.append(media)
                    .append(des);

                _this.$contentContainer.append($container);
            });
        };

        /**
         * Hides a placeholder that shows info of particular area.
         */
        Map.prototype.hideMapAreaInfo = function () {
            
        };

        /**
         * Loads data associated with map areas to the map.
         */
        Map.prototype.loadData = function (data) {
            if (data === this.mapData) {
                return;
            }

            this.mapData = data;
            this.generateTooltips();
        };

        Map.prototype.initInfoPanel = function() {
            var _this = this;

            this.$header = this.$infoPanel.find(".map-view-exhibit-info-header");
            this.$infoCloseBtn = this.$infoPanel.find(".map-view-exhibit-info-close-btn")
                .click(function () {
                    _this.$infoPanel.hide();
                });;
            this.$contentContainer = this.$infoPanel.find(".content-container");
        };

        Map.prototype.generateTooltips = function () {
            var ids = [],
                $container,
                template = $("#MapTooltipExhibitTemplate .tooltip-exhibit-container"),
                _this = this;

            // Create list of ids for map areas that are in mapData.
            Object.keys(this.mapData).forEach(function (key) {
                var item = _this.mapData[key];

                if (item.mapAreaId && ids.indexOf(item.mapAreaId === -1)) {
                    ids.push(item.mapAreaId);
                }
            });

            // Create tooltip for every map area contains all exhibits associated with this map area.
            ids.forEach(function (id) {
                var _$container = $("<div></div>");

                Object.keys(_this.mapData).filter(function (key) {
                    return _this.mapData[key].mapAreaId && _this.mapData[key].mapAreaId === id;
                }).forEach(function (key) {
                    var exhibit = _this.mapData[key];

                    var $tooltipItem = template.clone(true, true),
                        date = CZ.Dates.convertCoordinateToYear(exhibit.infodotDescription.date);

                    $tooltipItem.on("click", {
                            id: exhibit.mapAreaId,
                            info: exhibit.contentItems,
                            title: exhibit.infodotDescription.title + " (" + date.year + " " + date.regime + ")"
                        },
                        CZ.Common.map.showMapAreaInfo)
                        .attr("data-description", exhibit.infodotDescription.title)
                        .attr("data-date", date.year + " " + date.regime)
                        .find("img")
                            .attr("src", exhibit.contentItems[0].uri);

                    $tooltipItem.appendTo(_$container);
                });

                // Hack to add 'selected' class to subunit.
                // Html tag contains too much data in attrs, so $.addClass doesn't work.
                var _class = $(".subunit[data-id='" + id + "']").attr("class");
                $(".subunit[data-id='" + id + "']").attr("class", _class + " selected");

                $(_this.geoMapLayer.select(".subunit[data-id='" + id + "']"))
                    .tooltipster({
                        content: _$container,
                        interactive: true
                    });
            });
        };

        /**
         * Removes data associated with map areas.
         */
        Map.prototype.clearData = function () {
            this.mapData = null;

            // TODO: remove tooltipster from elements that were initialized before,
            //       remove data attrs associated with exhibits data,
            //       remove event handlers
        };

        /**
         * Close map view button click handler.
         */
        var onCloseBtnClick = function (event) {
            Map.prototype.hide.call(event.data);
        };

        return Map;
    })();

    CZ.Map = Map;
})(CZ || (CZ = {}));
