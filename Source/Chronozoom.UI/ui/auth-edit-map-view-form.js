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
                map;

            // We only need to add additional initialization in constructor.
            function FormEditMapView(container, formInfo) {
                _this = this;
                _super.call(this, container, formInfo);

                var exhibits = [];

                if (typeof formInfo.context.onMapExhibits !== "undefined" && formInfo.context.onMapExhibits.length > 0) {
                    exhibits = formInfo.context.onMapExhibits;
                }
                else {
                    exhibits = formInfo.context.timeline.exhibits;
                }

                map = CZ.Map.prototype.MapAfrica.call(CZ.Common.map, exhibits, formInfo.context.timeline);
                map.show();

                this.$navBackBtn = this.container.find(formInfo.navBackBtn);
                this.timeline = formInfo.context.timeline;

                // Show modified exhibit date in case if user returned back to map view during current timeline editing session.
                if (typeof formInfo.context.onMapExhibits !== "undefined" && formInfo.context.onMapExhibits.length > 0) {
                    var tempIds = [];

                    tempIds = formInfo.context.onMapExhibits.filter(function (exhibit) {
                            return exhibit.mapAreaId !== null;
                        })
                        .map(function (exhibit) {
                            return exhibit.id;
                        });
                    this.mapEvents = this.timeline.exhibits.filter(function (exhibit) {
                        return tempIds.indexOf(exhibit.guid) !== -1;
                    });

                    tempIds = formInfo.context.onMapExhibits.filter(function (exhibit) {
                            return exhibit.mapAreaId === null;
                        })
                        .map(function (exhibit) {
                            return exhibit.id;
                        });
                    this.notMapEvents = this.timeline.exhibits.filter(function (exhibit) {
                        return tempIds.indexOf(exhibit.guid) !== -1;
                    });
                }
                // Showing exhibit data from timeline because opening map view for the first time in this timeline editing session.
                else {
                    this.mapEvents = this.timeline.exhibits.filter(function (exhibit) {
                        return exhibit.mapAreaId !== null;
                    });
                    this.notMapEvents = this.timeline.exhibits.filter(function (exhibit) {
                        return exhibit.mapAreaId === null;
                    });
                }

                this.newMapEventForm = {
                    $container: this.container.find(formInfo.newMapEventForm.container),
                    $titleTextblock: this.container.find(formInfo.newMapEventForm.titleTextblock),
                    $emptyListPlaceholder: this.container.find(formInfo.newMapEventForm.emptyListPlaceholder),
                    $eventsListbox: this.container.find(formInfo.newMapEventForm.eventsListbox),
                    eventsListboxTemplate: formInfo.newMapEventForm.eventsListboxTemplate,
                    eventsListbox: new CZ.UI.NewMapEventListbox(container.find(formInfo.newMapEventForm.eventsListbox),
                        formInfo.newMapEventForm.eventsListboxTemplate,
                        this.notMapEvents)
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
                if (this.mapEvents.length > 0) {
                    this.currentMapEventsForm.$eventsListbox.show();
                    this.currentMapEventsForm.$emptyListPlaceholder.hide();
                }
                else {
                    this.currentMapEventsForm.$eventsListbox.hide();
                    this.currentMapEventsForm.$emptyListPlaceholder.show();
                }

                if (this.notMapEvents.length > 0) {
                    this.newMapEventForm.$eventsListbox.show();
                    this.newMapEventForm.$emptyListPlaceholder.hide();
                }
                else {
                    this.newMapEventForm.$eventsListbox.hide();
                    this.newMapEventForm.$emptyListPlaceholder.show();
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

                this.container.on("mapeventremoved", function (event, args) {//item, id) {
                    var item = args.item;
                    var id = args.id;

                    _this.currentMapEventsForm.eventsListbox.remove(item);

                    try {
                        $(".subunit[data-id='" + id + "']").attr("class",  $(".subunit[data-id='" + id + "']").attr("class").replace(/selected/g, ""))
                    }
                    catch (ex) {
                    }

                    if (_this.currentMapEventsForm.eventsListbox.items.length === 0) {
                        _this.currentMapEventsForm.$eventsListbox.hide();
                        _this.currentMapEventsForm.$emptyListPlaceholder.show();
                    }

                    _this.newMapEventForm.eventsListbox.add(item.data);
                });
            };

            FormEditMapView.prototype.addMapEvent = function (mapAreaId, index) {
                index = typeof index === "undefined" ? this.newMapEventForm.eventsListbox.listboxSelectedItemIndex : index;
                var item = this.newMapEventForm.eventsListbox.items[index];

                var cl = $(".subunit[data-id='" + mapAreaId + "']").attr("class");
                $(".subunit[data-id='" + mapAreaId + "']").attr("class", cl +" selected");

                this.newMapEventForm.eventsListbox.removeAt(index);
                this.currentMapEventsForm.eventsListbox.add(item.data, mapAreaId);

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
                        _this.newMapEventForm.eventsListbox.clear();
                        _this.currentMapEventsForm.eventsListbox.clear();
                    }
                });
            };

            /**
             * Click handler for navigation back button.
             */
            var onNavBackClicked = function (event) {
                if (_this.prevForm && _this.prevForm instanceof UI.FormEditTimeline) {
                    var _onMapExhibits = _this.currentMapEventsForm.eventsListbox.items.map(function (item) {
                        return {
                            id: item.data.guid,
                            mapAreaId: item.container.attr("data-map-area-id")
                        };
                    });

                    _this.newMapEventForm.eventsListbox.items.map(function (item) {
                        return _onMapExhibits.push({
                            id: item.data.guid,
                            mapAreaId: null
                        });
                    });

                    _this.prevForm.onMapExhibits = _onMapExhibits;
                }

                _this.back();

                map.hide();
            };

            return FormEditMapView;
        })(CZ.UI.FormBase);
        UI.FormEditMapView = FormEditMapView;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
