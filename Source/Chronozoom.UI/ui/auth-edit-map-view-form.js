var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditMapView = (function (_super) {
            __extends(FormEditMapView, _super);

            var _this,
                africa;

            // We only need to add additional initialization in constructor.
            function FormEditMapView(container, formInfo) {
                _this = this;
                _super.call(this, container, formInfo);

                africa = new CZ.MapAfrica(CZ.Common.mapLayerSelector);
                africa.show();

                this.$navBackBtn = this.container.find(formInfo.navBackBtn);
                this.timeline = formInfo.context.timeline;
                this.mapEvents = this.timeline.exhibits.filter(function (exhibit) {
                    return exhibit.mapAreaId !== null;
                });

                this.newMapEventForm = {
                    $container: this.container.find(formInfo.newMapEventForm.container),
                    $titleTextblock: this.container.find(formInfo.newMapEventForm.titleTextblock),
                    $emptyListPlaceholder: this.container.find(formInfo.newMapEventForm.emptyListPlaceholder),
                    $eventsListbox: this.container.find(formInfo.newMapEventForm.eventsListbox),
                    eventsListboxTemplate: formInfo.newMapEventForm.eventsListboxTemplate,
                    eventsListbox: new CZ.UI.NewMapEventListbox(container.find(formInfo.newMapEventForm.eventsListbox),
                        formInfo.newMapEventForm.eventsListboxTemplate,
                        this.timeline.exhibits)
                };

                this.currentMapEventsForm = {
                    $container: this.container.find(formInfo.currentMapEventsForm.container),
                    $titleTextblock: this.container.find(formInfo.currentMapEventsForm.titleTextblock),
                    $emptyListPlaceholder: this.container.find(formInfo.currentMapEventsForm.emptyListPlaceholder),
                    $eventsListbox: this.container.find(formInfo.currentMapEventsForm.eventsListbox),
                    $eventsListboxTemplate: this.container.find(formInfo.currentMapEventsForm.eventsListboxTemplate),
                    eventsListbox: new CZ.UI.CurrentMapEventsListbox(container.find(formInfo.currentMapEventsForm.eventsListbox),
                        formInfo.currentMapEventsForm.eventsListboxTemplate,
                        this.mapEvents)
                };

                this.initialize();
            }

            FormEditMapView.prototype.initialize = function () {
                if (this.mapEvents.length === 0) {
                    this.currentMapEventsForm.$eventsListbox.hide();
                    this.currentMapEventsForm.$emptyListPlaceholder.show();
                }

                this.$navBackBtn.on("click", onNavBackClicked);

                this.container.on("emptylistbox", function (event, listboxName) {
                    switch (listboxName) {
                        case "newMapEventListbox":
                            _this.newMapEventForm.$eventsListbox.hide();
                            _this.newMapEventForm.$emptyListPlaceholder.show();
                            break;
                        case "eventsOnMapListbox":                        
                            _this.currentMapEventsForm.$eventsListbox.hide();
                            _this.currentMapEventsForm.$emptyListPlaceholder.show();
                            break;
                    }
                });

                this.container.on("mapeventremoved", function (event, item) {
                    _this.currentMapEventsForm.eventsListbox.remove(item);

                    if (_this.currentMapEventsForm.eventsListbox.items.length === 0) {
                        _this.currentMapEventsForm.$eventsListbox.hide();
                        _this.currentMapEventsForm.$emptyListPlaceholder.show();
                    }

                    _this.newMapEventForm.eventsListbox.add(item.data);
                });
            };

            FormEditMapView.prototype.addMapEvent = function (index) {
                index = typeof index === "undefined" ? this.newMapEventForm.eventsListbox.listboxSelectedItemIndex : index;
                var item = this.newMapEventForm.eventsListbox.items[index];

                this.newMapEventForm.eventsListbox.removeAt(index);
                this.currentMapEventsForm.eventsListbox.add(item.data);

                if (this.currentMapEventsForm.eventsListbox.items.length > 0) {
                    this.currentMapEventsForm.$eventsListbox.show();
                    this.currentMapEventsForm.$emptyListPlaceholder.hide();
                }
            };

            FormEditMapView.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });
            };

            FormEditMapView.prototype.close = function () {
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                    }
                });
            };

            /**
             * Click handler for navigation back button.
             */
            var onNavBackClicked = function (event) {
                _this.back();

                africa.hide();
            };

            return FormEditMapView;
        })(CZ.UI.FormBase);
        UI.FormEditMapView = FormEditMapView;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
