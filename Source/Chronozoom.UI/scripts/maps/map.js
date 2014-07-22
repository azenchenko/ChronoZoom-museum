var CZ;
(function (CZ) {
    var Map = (function () {
        function Map(mapDiv) {
            this.mapDiv = mapDiv,
            this.map = null;
            this.$map = null;
            this.geoMapLayer;

            this.init();
        }

        /**
         * Creates datepicker based on given JQuery instance of div
         */
        Map.prototype.init = function () {
            var that = this;

            this.map = d3.select(this.mapDiv);
            this.$map = $(this.map[0]);
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

        return Map;
    })();

    CZ.Map = Map;
})(CZ || (CZ = {}));
