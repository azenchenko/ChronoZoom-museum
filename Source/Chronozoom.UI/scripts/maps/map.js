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

        /**
         * Removes data associated with map areas.
         */
        Map.prototype.clearData = function () {
            this.mapData = null;

            // TODO: remove event handlers etc.
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
