var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var CZ;
(function (CZ) {
    (function (UI) {
        var CurrentMapEventsListBox = (function (_super) {
            __extends(CurrentMapEventsListBox, _super);
            function CurrentMapEventsListBox(container, listItemContainer, exhibits) {
                var self = this;
                var listBoxInfo = {
                    context: exhibits
                };

                var listItemsInfo = {
                    default: {
                        container: listItemContainer,
                        uiMap: {
                            iconImg: ".cz-map-event-listitem-icon > img",
                            titleTextblock: ".cz-map-event-listitem-title",
                            descrTextblock: ".cz-map-event-listitem-year",
                            removeBtn: ".cz-listitem-remove-btn"
                        }
                    }
                };

                listItemsInfo.default.ctor = CurrentMapEventListItem;

                _super.call(this, container, listBoxInfo, listItemsInfo);
            }
            CurrentMapEventsListBox.prototype.remove = function (item) {
                for (var i = this.items.indexOf(item) + 1; i < this.items.length; i++)
                    if (this.items[i].data && this.items[i].data.order)
                        this.items[i].data.order--;

                _super.prototype.remove.call(this, item);
            };

            return CurrentMapEventsListBox;
        })(UI.ListBoxBase);
        UI.CurrentMapEventsListBox = CurrentMapEventsListBox;

        var CurrentMapEventListItem = (function (_super) {
            __extends(CurrentMapEventListItem, _super);

            function CurrentMapEventListItem(parent, container, uiMap, context) {
                var _this = this;
                _super.call(this, parent, container, uiMap, context);

                this.iconImg = this.container.find(uiMap.iconImg);
                this.titleTextblock = this.container.find(uiMap.titleTextblock);
                this.yearTextblock = this.container.find(uiMap.yearTextblock);
                this.removeBtn = this.container.find(uiMap.removeBtn);

                this.iconImg.attr("onerror", "this.src='/images/Temp-Thumbnail2.png';");
                this.iconImg.attr("src", this.data.uri);
                this.titleTextblock.text(this.data.title);
                this.yearTextblock.text(this.data.year);
            }
            return CurrentMapEventListItem;
        })(UI.ListItemBase);
        UI.CurrentMapEventListItem = CurrentMapEventListItem;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
