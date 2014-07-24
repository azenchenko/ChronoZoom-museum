var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var CZ;
(function (CZ) {
    (function (UI) {
        var NewMapEventListBox = (function (_super) {
            __extends(NewMapEventListBox, _super);
            function NewMapEventListBox(container, listItemContainer, exhibits) {
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
                            dateTextblock: ".cz-map-event-listitem-year"
                        }
                    }
                };

                listItemsInfo.default.ctor = NewMapEventListItem;

                _super.call(this, container, listBoxInfo, listItemsInfo);
            }
            NewMapEventListBox.prototype.remove = function (item) {
                for (var i = this.items.indexOf(item) + 1; i < this.items.length; i++)
                    if (this.items[i].data && this.items[i].data.order)
                        this.items[i].data.order--;

                _super.prototype.remove.call(this, item);
            };

            return NewMapEventListBox;
        })(UI.ListBoxBase);
        UI.NewMapEventListBox = NewMapEventListBox;

        var NewMapEventListItem = (function (_super) {
            __extends(NewMapEventListItem, _super);

            function NewMapEventListItem(parent, container, uiMap, context) {
                var _this = this;
                _super.call(this, parent, container, uiMap, context);

                var date = CZ.Dates.convertCoordinateToYear(this.data.infodotDescription.date);

                this.iconImg = this.container.find(uiMap.iconImg);
                this.titleTextblock = this.container.find(uiMap.titleTextblock);
                this.dateTextblock = this.container.find(uiMap.dateTextblock);

                this.iconImg.attr("onerror", "this.src='/images/Temp-Thumbnail2.png';");
                this.iconImg.attr("src", this.data.contentItems[0].uri);
                this.titleTextblock.text(this.data.title);
                this.dateTextblock.text(date.year + " " + date.regime);
            }
            return NewMapEventListItem;
        })(UI.ListItemBase);
        UI.NewMapEventListItem = NewMapEventListItem;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
