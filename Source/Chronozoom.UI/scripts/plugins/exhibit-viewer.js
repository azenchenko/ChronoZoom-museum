var CZ;
(function (CZ) {
    (function (UI) {
        var ExhibitFullscreenViewer = (function () {
            var _this;

            function ExhibitFullscreenViewer(control) {
                _this = this;

               this.exhibits = [];

               this.$control = control;
               this.$title = this.$control.find(".viewer-header-title");
               this.$closeBtn = this.$control.find(".viewer-header-close-btn");
               this.$contentContainer = this.$control.find(".viewer-items-container");
               this.$navBtnL = this.$control.find(".viewer-nav-btn_left");
               this.$navBtnR = this.$control.find(".viewer-nav-btn_right");
               this.$itemTemplate = this.$control.find("#viewer-item-template")
                    .find(".viewer-item");

                _init();

                return this;
            }

            /**
             * Shows exhibit fullscreen viewer, loads exhibits array and
             * displays item with given id.
             *
             * @param exhibits  (array) An array of exhibits to show in viewer.
             * @param id        (id)    ID of element to display.
             */
            ExhibitFullscreenViewer.prototype.show = function (exhibits, id) {
                var exhibit;

                if (typeof exhibits === "undefined") {
                    throw "ExhibitFullscreenViewer.show() can't be called " +
                          "with no params";
                    return;
                }

                if (exhibits.length === 0) {
                    throw "No exhibits were given to ExhibitFullscreenViewer.";
                    return;
                }

                this.$contentContainer.empty();
                this.exhibits = exhibits;

                if (typeof id === "undefined") {
                    exhibit = exhibits[0];
                }
                else {
                    exhibit = this.exhibits.filter(function (el) {
                        return el.id === id;
                    }[0];
                }

                _showExhibit(exhibit);

                this.control.show();
            };

            ExhibitFullscreenViewer.prototype.hide = function () {
                this.control.hide();
            };

            function _init () {
                _this.navBtnL.click(function () {
                    console.log("Navigation btn LEFT click");
                });

                _this.navBtnR.click(function () {
                    console.log("Navigation btn RIGHT click");
                });
            }

            function _showExhibit (exhibit) {
                console.log("Showing exhibit " + exhibit.id);

                var item,
                    $item;

                _this.$title = exhibit.title;

                for (var i = 0; i < exhibit.contentItems.length - 1; i++) {
                    item = exhibit.contentItems[i];
                    $item = _this.$itemTemplate.clone(true, true);

                    var $media = $item.find(".viewer-item-media"),
                        $title = $item.find(".viewer-item-title"),
                        $descr = $item.find(".viewer-item-description");

                    $title.text(item.title);
                    $descr.text(item.description);

                    switch (item.mediaType) {
                        case "video":
                            break;
                        case "image":
                            break;
                    }

                    _this.contentContainer.append($item);
                }
            }
        })();
        UI.ExhibitFullscreenViewer = ExhibitFullscreenViewer;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
