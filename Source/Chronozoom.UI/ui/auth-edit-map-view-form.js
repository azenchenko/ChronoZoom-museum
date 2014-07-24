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
                    $eventsListbox: this.container.find(formInfo.newMapEventForm.eventsListBox),
                    eventsListBoxTemplate: formInfo.newMapEventForm.eventsListBoxTemplate,
                    eventsListBox: new CZ.UI.NewMapEventListBox(container.find(formInfo.newMapEventForm.eventsListBox),
                        formInfo.newMapEventForm.eventsListBoxTemplate,
                        this.timeline.exhibits)
                };

                this.currentMapEventsForm = {
                    $container: this.container.find(formInfo.currentMapEventsForm.container),
                    $titleTextblock: this.container.find(formInfo.currentMapEventsForm.titleTextblock),
                    $emptyListPlaceholder: this.container.find(formInfo.currentMapEventsForm.emptyListPlaceholder),
                    $eventsListBox: this.container.find(formInfo.currentMapEventsForm.eventsListBox),
                    $eventsListBoxTemplate: this.container.find(formInfo.currentMapEventsForm.eventsListBoxTemplate),
                    eventsListBox: new CZ.UI.CurrentMapEventsListBox(container.find(formInfo.currentMapEventsForm.eventsListBox),
                        formInfo.currentMapEventsForm.eventsListBoxTemplate,
                        this.mapEvents)
                };

                this.initialize();
            }
            FormEditMapView.prototype.initialize = function () {
                if (this.mapEvents.length === 0) {
                    this.currentMapEventsForm.$eventsListBox.hide();
                    this.currentMapEventsForm.$emptyListPlaceholder.show();
                }

                this.$navBackBtn.on("click", onNavBackClicked);
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
