var CZ;
(function (CZ) {
    var Map = (function () {
        var _opts = {
            closeBtnClass: "map-close-btn"
        };

        function Map(mapDiv) {
            this.mapDiv = mapDiv;
            this.map = null;
            this.$map = null;
            this.geoMapLayer;
            this.$closeBtn = null;
            this.mapType = null;
        }

        /**
         * Creates datepicker based on given JQuery instance of div
         */
        Map.prototype.init = function () {
            this.map = d3.select(this.mapDiv);
            this.$map = $(this.map[0]);

            this.$closeBtn = $("<div></div>", {
                class: _opts.closeBtnClass,
                title: "Close the map view"
            });

            this.$closeBtn.appendTo(this.$map)
                .on("click", this, onCloseBtnClick);

            svg = this.map.append("svg");
            this.geoMapLayer = svg.append("g")
                .style("stroke-width", "1.5px");
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
        Map.prototype.showMapAreaInfo = function (id) {

        };

        /**
         * Hides a placeholder that shows info of particular area.
         */
        Map.prototype.hideMapAreaInfo = function () {
            
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
