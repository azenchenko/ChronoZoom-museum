var CZ;
(function (CZ) {
    var Map = (function () {
        var _opts = {
            closeBtnClass: "map-close-btn"
        },
            _this;

        function Map(mapDiv) {
            this.mapDiv = mapDiv;
            this.map = null;
            this.$map = null;
            this.geoMapLayer;
            this.$closeBtn = null;
        }

        /**
         * Creates datepicker based on given JQuery instance of div
         */
        Map.prototype.initialize = function () {
            _this = this;

            this.map = d3.select(this.mapDiv);
            this.$map = $(this.map[0]);
            this.$closeBtn = $("<div></div>", {
                class: _opts.closeBtnClass,
                title: "Close the map view"
            });

            this.$closeBtn.appendTo(this.$map)
                          .on("click", onCloseBtnClick);

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
         * Removes map object
         */
        Map.prototype.destroy = function () {
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
            Map.prototype.hide.call(_this);
        };

        return Map;
    })();

    CZ.Map = Map;
})(CZ || (CZ = {}));
