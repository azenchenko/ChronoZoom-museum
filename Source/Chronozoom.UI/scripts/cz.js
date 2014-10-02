/// <reference path='settings.ts'/>
/// <reference path='common.ts'/>
/// <reference path='timescale.ts'/>
/// <reference path='viewport-controller.ts'/>
/// <reference path='gestures.ts'/>
/// <reference path='tours.ts'/>
/// <reference path='virtual-canvas.ts'/>
/// <reference path='uiloader.ts'/>
/// <reference path='media.ts'/>
/// <reference path='../ui/controls/formbase.ts'/>
/// <reference path='../ui/controls/datepicker.ts'/>
/// <reference path='../ui/controls/medialist.ts'/>
/// <reference path='../ui/auth-edit-timeline-form.ts'/>
/// <reference path='../ui/auth-edit-exhibit-form.ts'/>
/// <reference path='../ui/auth-edit-contentitem-form.ts'/>
/// <reference path='../ui/auth-edit-tour-form.ts'/>
/// <reference path='../ui/auth-edit-collection-form.ts'/>
/// <reference path='../ui/auth-edit-collection-editors.ts'/>
/// <reference path='../ui/header-edit-form.ts' />
/// <reference path='../ui/header-edit-profile-form.ts'/>
/// <reference path='../ui/header-login-form.ts'/>
/// <reference path='../ui/header-search-form.ts' />
/// <reference path='../ui/timeseries-graph-form.ts'/>
/// <reference path='../ui/timeseries-data-form.ts'/>
/// <reference path='../ui/tourslist-form.ts'/>
/// <reference path='../ui/tour-caption-form.ts'/>
/// <reference path='../ui/message-window.ts'/>
/// <reference path='../ui/header-session-expired-form.ts'/>
/// <reference path='../ui/mediapicker-form.ts'/>
/// <reference path='typings/jquery/jquery.d.ts'/>
/// <reference path='extensions/extensions.ts'/>
/// <reference path='../ui/media/skydrive-mediapicker.ts'/>
/// <reference path='../ui/start-page.ts'/>
/// <reference path='plugins/error-plugin.ts'/>
/// <reference path='plugins/utility-plugins.ts'/>
var constants;

var CZ;
(function (CZ) {
    CZ.timeSeriesChart;
    CZ.leftDataSet;
    CZ.rightDataSet;

    // In demo mode authoring, login, timeseries, all clickable links, canvas icons are disabled.
    // Demo mode is turned on by using pair (demo_mode, true) in sarch part of URL.
    // For instanse: localhost:4949/myDemoCollection?demo_mode=true
    CZ._demoMode = false;

    (function (HomePageViewModel) {
        if (location.search.match(/demo_mode=true/)) {
            CZ._demoMode = true;

            // Kiosk mode is always on in demo mode.
            if (CZ.Settings && !$.isEmptyObject(CZ.Settings.theme)) {
                CZ.Settings.theme.kioskMode = true;
            }

            // Hide UI elements that shouldn't be visible in demo mode.
            $(".elements-demo-disable").hide();
        }

        // Contains mapping: CSS selector -> html file.
        var _uiMap = {
            "#header-edit-form": "/ui/header-edit-form.html",                                       // 0
            "#auth-edit-timeline-form": "/ui/auth-edit-timeline-form.html",                         // 1
            "#auth-edit-exhibit-form": "/ui/auth-edit-exhibit-form.html",                           // 2
            "#auth-edit-contentitem-form": "/ui/auth-edit-contentitem-form.html",                   // 3
            "$('<div></div>')": "/ui/contentitem-listbox.html",                                     // 4
            "#profile-form": "/ui/header-edit-profile-form.html",                                   // 5
            "#login-form": "/ui/header-login-form.html",                                            // 6
            "#auth-edit-tours-form": "/ui/auth-edit-tour-form.html",                                // 7
            "$('<div><!--Tours Authoring--></div>')": "/ui/tourstop-listbox.html",                  // 8
            "#toursList": "/ui/tourslist-form.html",                                                // 9
            "$('<div><!--Tours list item --></div>')": "/ui/tour-listbox.html",                     // 10
            "#timeSeriesContainer": "/ui/timeseries-graph-form.html",                               // 11
            "#timeSeriesDataForm": "/ui/timeseries-data-form.html",                                 // 12
            "#message-window": "/ui/message-window.html",                                           // 13
            "#header-search-form": "/ui/header-search-form.html",                                   // 14
            "#header-session-expired-form": "/ui/header-session-expired-form.html",                 // 15
            "#tour-caption-form": "/ui/tour-caption-form.html",                                     // 16
            "#mediapicker-form": "/ui/mediapicker-form.html",                                       // 17
            "#start-page": "/ui/start-page.html",                                                   // 18
            "#auth-edit-collection-form": "/ui/auth-edit-collection-form.html",                     // 19
            "#auth-edit-collection-editors": "/ui/auth-edit-collection-editors.html",               // 20
            "#auth-edit-map-view-form": "/ui/auth-edit-map-view-form.html",                         // 21
            "$('<div><!-- New Map Event Listbox --></div>')": "/ui/new-map-event-listbox.html",     // 22
            "$('<div><!-- Events On Map Listbox --></div>')": "/ui/events-on-map-listbox.html",     // 23
            "#auth-edit-select-maptype-form": "/ui/auth-edit-select-maptype-form.html",             // 24
			"#demo-navigation-form": "/ui/demo-navigation-form.html",                               // 25
            "#map-area-exhibits-form": "/ui/map-area-exhibits-form.html",                           // 26
            "$('<div><!-- Map Area Events Listbox --></div>')": "/ui/map-area-events-listbox.html"  // 27
        };

        (function (FeatureActivation) {
            FeatureActivation[FeatureActivation["Enabled"] = 0] = "Enabled";
            FeatureActivation[FeatureActivation["Disabled"] = 1] = "Disabled";
            FeatureActivation[FeatureActivation["RootCollection"] = 2] = "RootCollection";
            FeatureActivation[FeatureActivation["NotRootCollection"] = 3] = "NotRootCollection";
            FeatureActivation[FeatureActivation["NotProduction"] = 4] = "NotProduction";
        })(HomePageViewModel.FeatureActivation || (HomePageViewModel.FeatureActivation = {}));
        var FeatureActivation = HomePageViewModel.FeatureActivation;

        HomePageViewModel.sessionForm;

        // Basic Flight-Control (Tracks the features that are enabled)
        //
        // FEATURES CAN ONLY BE ACTIVATED IN ROOTCOLLECTION AFTER HITTING ZERO ACTIVE BUGS.
        //
        // REMOVING THIS COMMENT OR BYPASSING THIS CHECK MAY BRING YOU BAD KARMA, ITS TRUE.
        //
        var _featureMap = [
            {
                Name: "Login",
                Activation: 1 /* Disabled */,
                JQueryReference: "#login-panel"
            },
            {
                Name: "Search",
                Activation: 0 /* Enabled */,
                JQueryReference: "#search-button"
            },
            {
                Name: "Tours",
                Activation: 0 /* Enabled */,
                JQueryReference: "#tours-index"
            },
            {
                Name: "Authoring",
                Activation: 0 /* Enabled */,
                JQueryReference: ".header-icon.edit-icon"
            },
            {
                Name: "TourAuthoring",
                Activation: 0 /* Enabled */,
                JQueryReference: ".cz-form-create-tour"
            },
            {
                Name: "WelcomeScreen",
                Activation: 2 /* RootCollection */,
                JQueryReference: "#welcomeScreenBack"
            },
            {
                Name: "Regimes",
                Activation: 2 /* RootCollection */,
                JQueryReference: ".header-regimes"
            },
            {
                Name: "TimeSeries",
                Activation: 1 /* Disabled */
            },
            {
                Name: "ManageCollections",
                Activation: 1 /* Disabled */,
                JQueryReference: "#collections_button"
            },
            {
                Name: "BreadCrumbs",
                Activation: 0 /* Enabled */,
                JQueryReference: ".header-breadcrumbs"
            },
            {
                Name: "Skydrive",
                Activation: 1 /* Disabled */
            },
            {
                Name: "Bing",
                Activation: 1 /* Disabled */
            },
            {
                Name: "StartPage",
                Activation: 1 /* Disabled */,
                JQueryReference: ".header-icon.home-icon"
            },
            {
                Name: "CollectionsAuthoring",
                Activation: 0 /* Enabled */
            }
        ];

        var _formEditMapView;

        $("body").on("mapareaclicked", function (event, data) {
            console.log(data.mapAreaId);
            _formEditMapView.addMapEvent(data.mapAreaId);
        });

        HomePageViewModel.rootCollection;

        function UserCanEditCollection(profile) {
            // In demo mode authoring is disabled.
            if (CZ._demoMode) {
                return false;
            }

            // override - anyone can edit the sandbox
            if (CZ.Service.superCollectionName && CZ.Service.superCollectionName.toLowerCase() === "sandbox") {
                return true;
            }

            // can't edit if no profile, no display name, no supercollection or no collection
            if (!profile || !profile.DisplayName || !CZ.Service.superCollectionName || !CZ.Service.collectionName) {
                return false;
            }

            // if here then logged in and on a page (other than sandbox) with a supercollection and collection
            // so return canEdit Boolean, which was previously set after looking up permissions in db.
            return CZ.Service.canEdit;
        }

        function InitializeToursUI(profile, forms) {
            CZ.Tours.tourCaptionFormContainer = forms[16];
            var allowEditing = IsFeatureEnabled(_featureMap, "TourAuthoring") && UserCanEditCollection(profile);

            var onTakeTour = function (tour) {
                CZ.HomePageViewModel.closeAllForms();
                CZ.Tours.tourCaptionForm = new CZ.UI.FormTourCaption(CZ.Tours.tourCaptionFormContainer, {
                    activationSource: $(".tour-icon"),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-tour-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-tour-form-title",
                    contentContainer: ".cz-form-content",
                    minButton: ".cz-tour-form-min-btn > .cz-form-btn",
                    captionTextarea: ".cz-form-tour-caption",
                    tourPlayerContainer: ".cz-form-tour-player",
                    bookmarksCount: ".cz-form-tour-bookmarks-count",
                    narrationToggle: ".cz-toggle-narration",
                    context: tour
                });
                CZ.Tours.tourCaptionForm.show();

                CZ.Tours.removeActiveTour();
                CZ.Tours.activateTour(tour, undefined);
            };

            var onToursInitialized = function () {
                $("#tours_index").click(function () {
                    var toursListForm = getFormById("#toursList");
                    console.log("toursListForm", toursListForm);
                    if (toursListForm.isFormVisible) {
                        toursListForm.close();
                    } else {
                        if (!$("#start-page").is(":visible")) {
                            closeAllForms();
                            var form = new CZ.UI.FormToursList(forms[9], {
                                activationSource: $(this),
                                navButton: ".cz-form-nav",
                                closeButton: ".cz-form-close-btn > .cz-form-btn",
                                titleTextblock: ".cz-form-title",
                                tourTemplate: forms[10],
                                tours: CZ.Tours.tours,
                                takeTour: onTakeTour,
                                editTour: allowEditing ? function (tour) {
                                    if (CZ.Authoring.showEditTourForm)
                                        CZ.Authoring.showEditTourForm(tour);
                                } : null,
                                createTour: ".cz-form-create-tour"
                            });
                            form.show();
                        }
                    }
                });
            };
            if (CZ.Tours.tours)
                onToursInitialized();
            else
                $("body").bind("toursInitialized", onToursInitialized);
        }

        var defaultRootTimeline = { title: "My Timeline", x: 1950, endDate: 9999, children: [], parent: { guid: null }, exhibits: [] };

        $(document).ready(function () {
            // ensures there will be no 'console is undefined' errors
            window.console = window.console || (function () {
                var c = {};
                c.log = c.warn = c.debug = c.info = c.log = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
                };
                return c;
            })();

            $('.bubbleInfo').hide();

            // auto-hourglass
            $('#wait').hide();

            $(document).ajaxStart(function () {
                $('#wait').show();
            });
            $(document).ajaxStop(function () {
                $('#wait').hide();
            });

            // populate collection names from URL
            var url = CZ.UrlNav.getURL();
            HomePageViewModel.rootCollection = url.superCollectionName === undefined;
            CZ.Service.superCollectionName = url.superCollectionName;
            CZ.Service.collectionName = url.collectionName;
            CZ.Common.initialContent = url.content;

            // apply features
            ApplyFeatureActivation();

            // register ChronoZoom extensions
            CZ.Extensions.registerExtensions();

            // register ChronoZoom media pickers
            CZ.Media.SkyDriveMediaPicker.isEnabled = IsFeatureEnabled(_featureMap, "Skydrive");
            CZ.Media.BingMediaPicker.isEnabled = IsFeatureEnabled(_featureMap, "Bing");
            CZ.Media.initialize();
            CZ.Common.initialize();

            // hook logo click
            $('.header-logo').click(function () {
                if (!CZ._demoMode) {
                    window.location.href = '/';
                }
            });

            // if URL has a supercollection and collection then
            // check if current user has edit permissions before continuing with load
            // since other parts of load need to know if can display edit buttons etc.
            if (CZ.Service.superCollectionName === undefined || CZ.Service.collectionName === undefined) {
                CZ.Service.canEdit = false;
                finishLoad();
            } else {
                CZ.Service.getCanEdit().done(function (result) {
                    CZ.Service.canEdit = (result === true);
                    finishLoad();
                });
            }
        });

        function finishLoad() {
            // only invoked after user's edit permissions are checked (AJAX callback)
            CZ.UILoader.loadAll(_uiMap).done(function () {
                // Setting up idling definition if it's demo mode.
                if (CZ._demoMode) {
                    $(document).on(CZ.Settings.idleBreakingEvents.join(" "), function () {
                        CZ.Common.setupIdleTimeout();
                    });

                    // Start initial idling timeout.
                    CZ.Common.setupIdleTimeout();
                }

                var forms = arguments;

                CZ.timeSeriesChart = new CZ.UI.LineChart(forms[11]);

                $('#timeSeries_button').click(function () {
                    var tsForm = getFormById('#timeSeriesDataForm');
                    if (tsForm === false) {
                        closeAllForms();

                        var timSeriesDataFormDiv = forms[12];
                        var timSeriesDataForm = new CZ.UI.TimeSeriesDataForm(timSeriesDataFormDiv, {
                            activationSource: $("#timeSeries_button"),
                            closeButton: ".cz-form-close-btn > .cz-form-btn"
                        });
                        timSeriesDataForm.show();
                    } else {
                        if (tsForm.isFormVisible) {
                            tsForm.close();
                        } else {
                            closeAllForms();
                            tsForm.show();
                        }
                    }
                });

                $(".header-icon.edit-icon").click(function () {
                    var editForm = getFormById("#header-edit-form");
                    if (editForm === false) {
                        closeAllForms();
                        var form = new CZ.UI.FormHeaderEdit(forms[0], {
                            activationSource: $(this),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            createTimeline: ".cz-form-create-timeline",
                            createExhibit: ".cz-form-create-exhibit",
                            createTour: ".cz-form-create-tour"
                        });
                        form.show();
                        ApplyFeatureActivation();
                    } else {
                        if (editForm.isFormVisible) {
                            editForm.close();
                        } else {
                            closeAllForms();
                            editForm.show();
                        }
                    }
                });

                $(".header-icon.search-icon").click(function () {
                    var searchForm = getFormById("#header-search-form");
                    if (searchForm === false) {
                        closeAllForms();
                        var form = new CZ.UI.FormHeaderSearch(forms[14], {
                            activationSource: $(this),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            searchTextbox: ".cz-form-search-input",
                            searchResultsBox: ".cz-form-search-results",
                            progressBar: ".cz-form-progress-bar",
                            resultSections: ".cz-form-search-results > .cz-form-search-section",
                            resultsCountTextblock: ".cz-form-search-results-count"
                        });
                        form.show();
                    } else {
                        if (searchForm.isFormVisible) {
                            searchForm.close();
                        } else {
                            closeAllForms();
                            searchForm.show();
                        }
                    }
                });

                CZ._demoNavigationForm = new CZ.UI.DemoNavigationForm(forms[25], {
                    activationSource: $(this),
                    navButton: ".cz-form-nav",
                    titleTextblock: ".cz-form-title",
                    contentContainer: ".cz-form-content",
                    formHeader: ".cz-form-header",
                    minorContainer: ".minor-container",
                    searchTextbox: ".cz-form-search-input",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    sideButton: ".cz-form-side-button",
                    searchResultsBox: ".cz-form-search-results",
                    progressBar: ".cz-form-progress-bar",
                    resultSections: ".cz-form-search-results > .cz-form-search-section",
                    resultsCountTextblock: ".cz-form-search-results-count"
                });

                if (CZ._demoMode) {
                    CZ._demoNavigationForm.show();
                }

                $("#editCollectionButton").click(function () {
                    closeAllForms();
                    var form = new CZ.UI.FormEditCollection(forms[19], {
                        activationSource: $(".header-icon.edit-icon"),
                        navButton: ".cz-form-nav",
                        closeButton: ".cz-form-close-btn > .cz-form-btn",
                        titleTextblock: ".cz-form-title",
                        saveButton: ".cz-form-save",
                        collectionTheme: CZ.Settings.theme,
                        backgroundInput: $(".cz-form-item-collection-background"),
                        backgroundInputName: $(".cz-form-item-collection-background-name"),
                        backgroundInputContainer: ".cz-form-collection-background-image-container",
                        chkBackgroundImage: ".cz-form-collection-background-checkbox",
                        kioskmodeInput: $(".cz-form-collection-kioskmode"),
                        mediaListContainer: ".cz-form-medialist",
                        timelineBackgroundColorInput: $(".cz-form-timeline-background"),
                        timelineBackgroundOpacityInput: $(".cz-form-timeline-background-opacity"),
                        timelineBorderColorInput: $(".cz-form-timeline-border"),
                        exhibitBackgroundColorInput: $(".cz-form-exhibit-background"),
                        exhibitBackgroundOpacityInput: $(".cz-form-exhibit-background-opacity"),
                        exhibitBorderColorInput: $(".cz-form-exhibit-border"),
                        chkEditors: "#cz-form-multiuser-enable",
                        btnEditors: "#cz-form-multiuser-manage",
                        idleTimeoutContainer: ".cz-form-collection-idle-timeout-container",
                        inputIdleTimeout: ".cz-form-collection-idle-timeout",
                        chkAutoPlayback: ".cz-form-collection-auto-tours"
                    });
                    form.show();
                });

                $('body').on('click', '#cz-form-multiuser-manage', function (event) {
                    var form = new CZ.UI.FormManageEditors(forms[20], {
                        activationSource: $(this),
                        navButton: ".cz-form-nav",
                        titleTextblock: ".cz-form-title",
                        closeButton: ".cz-form-close-btn > .cz-form-btn",
                        saveButton: ".cz-form-save"
                    });
                    form.show();
                });

                CZ.Authoring.initialize(CZ.Common.vc, {
                    showMessageWindow: function (message, title, onClose) {
                        var wnd = new CZ.UI.MessageWindow(forms[13], message, title);
                        if (onClose)
                            wnd.container.bind("close", function () {
                                wnd.container.unbind("close", onClose);
                                onClose();
                            });
                        wnd.show();
                    },
                    hideMessageWindow: function () {
                        var wnd = forms[13].data("form");
                        if (wnd)
                            wnd.close();
                    },
                    showEditTourForm: function (tour) {
                        CZ.Tours.removeActiveTour();
                        var form = new CZ.UI.FormEditTour(forms[7], {
                            activationSource: $(".header-icon.edit-icon"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            addStopButton: ".cz-form-tour-addstop",
                            titleInput: ".cz-form-title",
                            tourStopsListbox: "#stopsList",
                            tourStopsTemplate: forms[8],
                            context: tour
                        });
                        form.show();
                    },
                    showCreateTimelineForm: function (timeline) {
                        CZ.Authoring.hideMessageWindow();
                        CZ.Authoring.mode = "createTimeline";
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $(".header-icon.edit-icon"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            errorMessage: "#error-edit-timeline",
                            context: timeline
                        });
                        form.show();
                    },
                    showCreateRootTimelineForm: function (timeline) {
                        CZ.Authoring.mode = "createRootTimeline";
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $(".header-icon.edit-icon"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            errorMessage: "#error-edit-timeline",
                            context: timeline
                        });
                        form.show();
                    },
                    showEditTimelineForm: function (timeline) {
                        var form = new CZ.UI.FormEditTimeline(forms[1], {
                            activationSource: $(".header-icon.edit-icon"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            startDate: ".cz-form-time-start",
                            endDate: ".cz-form-time-end",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            titleInput: ".cz-form-item-title",
                            errorMessage: "#error-edit-timeline",
                            context: timeline
                        });
                        form.show();
                    },
                    showCreateExhibitForm: function (exhibit) {
                        CZ.Authoring.hideMessageWindow();
                        var form = new CZ.UI.FormEditExhibit(forms[2], {
                            activationSource: $(".header-icon.edit-icon"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            titleInput: ".cz-form-item-title",
                            datePicker: ".cz-form-time",
                            createArtifactButton: ".cz-form-create-artifact",
                            contentItemsListbox: ".cz-listbox",
                            errorMessage: ".cz-form-errormsg",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            contentItemsTemplate: forms[4],
                            context: exhibit
                        });
                        form.show();
                    },
                    showEditExhibitForm: function (exhibit) {
                        var form = new CZ.UI.FormEditExhibit(forms[2], {
                            activationSource: $(".header-icon.edit-icon"),
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            titleInput: ".cz-form-item-title",
                            datePicker: ".cz-form-time",
                            createArtifactButton: ".cz-form-create-artifact",
                            contentItemsListbox: ".cz-listbox",
                            errorMessage: ".cz-form-errormsg",
                            saveButton: ".cz-form-save",
                            deleteButton: ".cz-form-delete",
                            contentItemsTemplate: forms[4],
                            context: exhibit
                        });
                        form.show();
                    },
                    showEditContentItemForm: function (ci, e, prevForm, noAnimation) {
                        var form = new CZ.UI.FormEditCI(forms[3], {
                            activationSource: $(".header-icon.edit-icon"),
                            prevForm: prevForm,
                            navButton: ".cz-form-nav",
                            closeButton: ".cz-form-close-btn > .cz-form-btn",
                            titleTextblock: ".cz-form-title",
                            errorMessage: ".cz-form-errormsg",
                            saveButton: ".cz-form-save",
                            titleInput: ".cz-form-item-title",
                            mediaSourceInput: ".cz-form-item-mediasource",
                            mediaInput: ".cz-form-item-mediaurl",
                            mediaInputName:".cz-form-item-mediaurl-name",
                            descriptionInput: ".cz-form-item-descr",
                            attributionInput: ".cz-form-item-attribution",
                            mediaTypeInput: ".cz-form-item-media-type",
                            mediaListContainer: ".cz-form-medialist",
                            context: {
                                exhibit: e,
                                contentItem: ci
                            }
                        });
                        form.show(noAnimation);
                    },

                    showEditMapViewForm: function (prevForm, context) {
                        _formEditMapView = new CZ.UI.FormEditMapView(forms[21], {
                            prevForm: prevForm,
                            navBackBtn: ".cz-form-nav",
                            newMapEventForm: {
                                container: ".cz-form-new-map-event",
                                titleTextblock: ".cz-form-new-map-event .cz-form-title",
                                emptyListPlaceholder: ".cz-form-new-map-event .cz-form-msg-placeholder",
                                eventsListbox: ".cz-form-new-map-event .cz-listbox",
                                eventsListboxTemplate: forms[22]
                            },
                            currentMapEventsForm: {
                                container: ".cz-form-current-map-events",
                                titleTextblock: ".cz-form-current-map-events .cz-form-title",
                                emptyListPlaceholder: ".cz-form-current-map-events .cz-form-msg-placeholder",
                                eventsListbox: ".cz-form-current-map-events .cz-listbox",
                                eventsListboxTemplate: forms[23]
                            },
                            context: {
                                timeline: context.timeline,
                                exhibits: context.exhibits,
                                mapType: context.mapType
                            }
                        });

                        _formEditMapView.show();
                    },

                    showSelectMapTypeForm: function (prevForm, context) {
                        var form = new CZ.UI.FormSelectMapType(forms[24], {
                            prevForm: prevForm,
                            navButton: ".cz-form-nav",
                            mapTypeInput: ".cz-form-item-map-type",
                            nextButton: ".cz-form-next",
                            context: {
                                timeline: context.timeline,
                                exhibits: context.exhibits
                            }
                        });

                        form.show();
                    }
                });

                window._MapAreaExhibitsForm = new CZ.UI.MapAreaExhibitsForm(forms[26], {
                    container: ".cz-form-map-area-exhibits",
                    titleTextblock: ".cz-form-title",
                    eventsListbox: ".cz-listbox",
                    eventsListboxTemplate: forms[27]
                });

                HomePageViewModel.sessionForm = new CZ.UI.FormHeaderSessionExpired(forms[15], {
                    activationSource: $("#header-session-expired-form"),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    titleInput: ".cz-form-item-title",
                    context: "",
                    sessionTimeSpan: "#session-time",
                    sessionButton: "#session-button"
                });

                CZ.Service.getProfile().done(function (data) {
                    //Authorized
                    if (data != "") {
                        CZ.Settings.isAuthorized = true;
                        CZ.Authoring.timer = setTimeout(function () {
                            CZ.Authoring.showSessionForm();
                        }, (CZ.Settings.sessionTime - 60) * 1000);
                    }

                    CZ.Authoring.isEnabled = UserCanEditCollection(data);
                }).fail(function (error) {
                    CZ.Authoring.isEnabled = UserCanEditCollection(null);
                    CZ.Settings.isAuthorized = UserCanEditCollection(null);
                }).always(function () {
                    if (!CZ.Authoring.isEnabled)
                        $('.edit-icon').hide(); // hide create icon if don't have edit rights

                    if (!CZ.Authoring.isEnabled && !CZ.Settings.isAuthorized) {
                        $("#WelcomeBlock").attr("data-toggle", "show");
                        $("#TwitterBlock").attr("data-toggle", "show");
                    } else {
                        $("#FavoriteTimelinesBlock").attr("data-toggle", "show");
                        $("#MyTimelinesBlock").attr("data-toggle", "show");
                    }

                    if (CZ.Authoring.isEnabled && IsFeatureEnabled(_featureMap, "CollectionsAuthoring")) {
                        $("#editCollectionButton").show();
                    }

                    //retrieving the data
                    CZ.Common.loadData().then(function (response) {
                        // collection is empty
                        if (!response) {
                            // author should create a root timeline
                            // TODO: store 'user' variable in CZ that is the response of getProfile()
                            if (CZ.Authoring.isEnabled) {
                                if (CZ.Authoring.showCreateRootTimelineForm) {
                                    CZ.Authoring.showCreateRootTimelineForm(defaultRootTimeline);
                                }
                            } else {
                                CZ.Authoring.showMessageWindow("Looks like this collection is empty. Come back later when author will fill it with content.", "Collection is empty :(");
                            }
                        }
                    });
                });

                var profileForm = new CZ.UI.FormEditProfile(forms[5], {
                    activationSource: $("#login-panel"),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    saveButton: "#cz-form-save",
                    logoutButton: "#cz-form-logout",
                    titleInput: ".cz-form-item-title",
                    usernameInput: ".cz-form-username",
                    emailInput: ".cz-form-email",
                    agreeInput: ".cz-form-agree",
                    loginPanel: "#login-panel",
                    profilePanel: "#profile-panel",
                    loginPanelLogin: "#profile-panel.auth-panel-login",
                    context: "",
                    allowRedirect: IsFeatureEnabled(_featureMap, "Authoring")
                });

                var loginForm = new CZ.UI.FormLogin(forms[6], {
                    activationSource: $("#login-panel"),
                    navButton: ".cz-form-nav",
                    closeButton: ".cz-form-close-btn > .cz-form-btn",
                    titleTextblock: ".cz-form-title",
                    titleInput: ".cz-form-item-title",
                    context: ""
                });

                $("#profile-panel").click(function (event) {
                    event.preventDefault();
                    if (!profileForm.isFormVisible) {
                        closeAllForms();
                        profileForm.show();
                    } else {
                        profileForm.close();
                    }
                });

                InitializeToursUI(null, forms);

                if (IsFeatureEnabled(_featureMap, "Login")) {
                    CZ.Service.getProfile().done(function (data) {
                        //Not authorized
                        if (data == "") {
                            $("#login-panel").show();
                        } else if (data != "" && data.DisplayName == null) {
                            $("#login-panel").hide();
                            $("#profile-panel").show();
                            $("#profile-panel input#username").focus();

                            if (!profileForm.isFormVisible) {
                                closeAllForms();
                                profileForm.show();
                            } else {
                                profileForm.close();
                            }
                        } else {
                            CZ.Settings.userSuperCollectionName = data.DisplayName;
                            CZ.Settings.userCollectionName = data.DisplayName;
                            $("#login-panel").hide();
                            $("#profile-panel").show();
                            $(".auth-panel-login").html(data.DisplayName);
                        }

                        InitializeToursUI(data, forms);
                    }).fail(function (error) {
                        $("#login-panel").show();

                        InitializeToursUI(null, forms);
                    });
                }

                $("#login-panel").click(function (event) {
                    event.preventDefault();
                    if (!loginForm.isFormVisible) {
                        closeAllForms();
                        loginForm.show();
                    } else {
                        loginForm.close();
                    }
                });
                if (IsFeatureEnabled(_featureMap, "StartPage")) {
                    CZ.StartPage.initialize();
                }
            });

            CZ.Service.getServiceInformation().then(function (response) {
                CZ.Settings.contentItemThumbnailBaseUri = "/" + response.thumbnailsPath + "/";
                // CZ.Settings.signinUrlMicrosoft = response.signinUrlMicrosoft;
                // CZ.Settings.signinUrlGoogle = response.signinUrlGoogle;
                // CZ.Settings.signinUrlYahoo = response.signinUrlYahoo;
            });

            CZ.Settings.applyTheme(null, CZ.Service.superCollectionName != null);

            // If not the root URL.
            if (CZ.Service.superCollectionName) {
                CZ.Service.getCollections(CZ.Service.superCollectionName).then(function (response) {
                    $(response).each(function (index) {
                        if (response[index] && response[index].Title.toLowerCase() === CZ.Service.collectionName.toLowerCase()) {
                            var themeData = null;
                            try  {
                                themeData = JSON.parse(response[index].theme);
                            } catch (e) {
                            }

                            CZ.Settings.applyTheme(themeData, false);
                        }
                    });
                });
            }

            $('#breadcrumbs-nav-left').click(CZ.BreadCrumbs.breadCrumbNavLeft);
            $('#breadcrumbs-nav-right').click(CZ.BreadCrumbs.breadCrumbNavRight);

            $('#biblCloseButton').mouseout(function () {
                CZ.Common.toggleOffImage('biblCloseButton', 'png');
            }).mouseover(function () {
                CZ.Common.toggleOnImage('biblCloseButton', 'png');
            });

            if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
                // Suppress the default iOS elastic pan/zoom actions.
                document.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                });
            }

            if (navigator.userAgent.indexOf('Mac') != -1) {
                // Disable Mac OS Scrolling Bounce Effect
                var body = document.getElementsByTagName('body')[0];
                body.style.overflow = "hidden";
            }

            // init seadragon. set path to image resources for nav buttons
            Seadragon.Config.imagePath = CZ.Settings.seadragonImagePath;

            if (window.location.hash)
                CZ.Common.startHash = window.location.hash; // to be processes after the data is loaded

            CZ.Search.initializeSearch();
            CZ.Bibliography.initializeBibliography();

            var canvasGestures = CZ.Gestures.getGesturesStream(CZ.Common.vc);
            var axisGestures = CZ.Gestures.applyAxisBehavior(CZ.Gestures.getGesturesStream(CZ.Common.ax));
            var timeSeriesGestures = CZ.Gestures.getPanPinGesturesStream($("#timeSeriesContainer"));
            var jointGesturesStream = canvasGestures.Merge(axisGestures.Merge(timeSeriesGestures));

            CZ.Common.controller = new CZ.ViewportController.ViewportController2(function (visible) {
                var vp = CZ.Common.vc.virtualCanvas("getViewport");
                var markerPos = CZ.Common.axis.markerPosition;
                var oldMarkerPosInScreen = vp.pointVirtualToScreen(markerPos, 0).x;

                CZ.Common.vc.virtualCanvas("setVisible", visible, CZ.Common.controller.activeAnimation);
                CZ.Common.updateAxis(CZ.Common.vc, CZ.Common.ax);
                vp = CZ.Common.vc.virtualCanvas("getViewport");
                if (CZ.Tours.pauseTourAtAnyAnimation) {
                    CZ.Tours.tourPause();
                    CZ.Tours.pauseTourAtAnyAnimation = false;
                }

                var hoveredInfodot = CZ.Common.vc.virtualCanvas("getHoveredInfodot");
                var actAni = CZ.Common.controller.activeAnimation != undefined;

                if (actAni) {
                    var newMarkerPos = vp.pointScreenToVirtual(oldMarkerPosInScreen, 0).x;
                    CZ.Common.updateMarker();
                }

                updateTimeSeriesChart(vp);
            }, function () {
                return CZ.Common.vc.virtualCanvas("getViewport");
            }, jointGesturesStream);

            var hashChangeFromOutside = true;

            // URL Nav: update URL when animation is complete
            CZ.Common.controller.onAnimationComplete.push(function (id) {
                hashChangeFromOutside = false;
                if (CZ.Common.setNavigationStringTo && CZ.Common.setNavigationStringTo.bookmark) {
                    CZ.UrlNav.navigationAnchor = CZ.UrlNav.navStringTovcElement(CZ.Common.setNavigationStringTo.bookmark, CZ.Common.vc.virtualCanvas("getLayerContent"));
                    window.location.hash = CZ.Common.setNavigationStringTo.bookmark;
                } else {
                    if (CZ.Common.setNavigationStringTo && CZ.Common.setNavigationStringTo.id == id)
                        CZ.UrlNav.navigationAnchor = CZ.Common.setNavigationStringTo.element;

                    var vp = CZ.Common.vc.virtualCanvas("getViewport");
                    window.location.hash = CZ.UrlNav.vcelementToNavString(CZ.UrlNav.navigationAnchor, vp);
                }
                CZ.Common.setNavigationStringTo = null;
            });

            // URL Nav: handle URL changes from outside
            window.addEventListener("hashchange", function () {
                if (window.location.hash && hashChangeFromOutside && CZ.Common.hashHandle) {
                    var hash = window.location.hash;
                    var visReg = CZ.UrlNav.navStringToVisible(window.location.hash.substring(1), CZ.Common.vc);
                    if (visReg) {
                        CZ.Common.isAxisFreezed = true;
                        CZ.Common.controller.moveToVisible(visReg, true);

                        // to make sure that the hash is correct (it can be incorrectly changed in onCurrentlyObservedInfodotChanged)
                        if (window.location.hash != hash) {
                            hashChangeFromOutside = false;
                            window.location.hash = hash;
                        }
                    }
                    CZ.Common.hashHandle = true;
                } else
                    hashChangeFromOutside = true;
            });

            //Tour: notifyng tour that the bookmark is reached
            CZ.Common.controller.onAnimationComplete.push(function (id) {
                if (CZ.Tours.tourBookmarkTransitionCompleted != undefined)
                    CZ.Tours.tourBookmarkTransitionCompleted(id);
                if (CZ.Tours.tour != undefined && CZ.Tours.tour.state != "finished")
                    CZ.Tours.pauseTourAtAnyAnimation = true;
            });

            //Tour: notifyng tour that the transition was interrupted
            CZ.Common.controller.onAnimationUpdated.push(function (oldId, newId) {
                if (CZ.Tours.tour != undefined) {
                    if (CZ.Tours.tourBookmarkTransitionInterrupted != undefined) {
                        var prevState = CZ.Tours.tour.state;
                        CZ.Tours.tourBookmarkTransitionInterrupted(oldId);
                        var alteredState = CZ.Tours.tour.state;

                        if (prevState == "play" && alteredState == "pause")
                            CZ.Tours.tourPause();

                        CZ.Common.setNavigationStringTo = null;
                    }
                }
            });

            CZ.Common.updateLayout();

            CZ.Common.vc.bind("elementclick", function (e) {
                CZ.Search.navigateToElement(e);
            });

            CZ.Common.vc.bind('cursorPositionChanged', function (cursorPositionChangedEvent) {
                CZ.Common.updateMarker();
            });

            // Reacting on the event when one of the infodot exploration causes inner zoom constraint
            CZ.Common.vc.bind("innerZoomConstraintChanged", function (constraint) {
                CZ.Common.controller.effectiveExplorationZoomConstraint = constraint.zoomValue; // applying the constraint
                CZ.Common.axis.allowMarkerMovesOnHover = !constraint.zoomValue;
            });

            CZ.Common.vc.bind("breadCrumbsChanged", function (breadCrumbsEvent) {
                CZ.BreadCrumbs.updateBreadCrumbsLabels(breadCrumbsEvent.breadCrumbs);
            });

            $(window).bind('resize', function () {
                if (CZ.timeSeriesChart) {
                    CZ.timeSeriesChart.updateCanvasHeight();
                }

                CZ.Common.updateLayout();

                //updating timeSeries chart
                var vp = CZ.Common.vc.virtualCanvas("getViewport");


                // In demo mode timeseries are disabled.
                if (!CZ._demoMode) {
                    updateTimeSeriesChart(vp);
                }
            });

            var vp = CZ.Common.vc.virtualCanvas("getViewport");
            CZ.Common.vc.virtualCanvas("setVisible", CZ.VCContent.getVisibleForElement({
                x: -13700000000,
                y: 0,
                width: 13700000000,
                height: 5535444444.444445
            }, 1.0, vp, false), true);
            CZ.Common.updateAxis(CZ.Common.vc, CZ.Common.ax);

            var bid = window.location.hash.match("b=([a-z0-9_]+)");
            if (bid) {
                //bid[0] - source string
                //bid[1] - found match
                $("#bibliography .sources").empty();
                $("#bibliography .title").append($("<span></span>", {
                    text: "Loading..."
                }));
                $("#bibliographyBack").css("display", "block");
            }
        }

        function IsFeatureEnabled(featureMap, featureName) {
            var feature = $.grep(featureMap, function (e) {
                return e.Name === featureName;
            });
            return feature[0].IsEnabled;
        }
        HomePageViewModel.IsFeatureEnabled = IsFeatureEnabled;

        function closeAllForms() {
            $('.cz-major-form').each(function (i, f) {
                var form = $(f).data('form');
                if (form && form.isFormVisible === true) {
                    form.close();
                }
            });
        }
        HomePageViewModel.closeAllForms = closeAllForms;

        function getFormById(name) {
            var form = $(name).data("form");
            if (form)
                return form;
            else
                return false;
        }
        HomePageViewModel.getFormById = getFormById;

        function showTimeSeriesChart() {
            $('#timeSeriesContainer').height('30%');
            $('#timeSeriesContainer').show();
            $('#vc').height('70%');
            CZ.timeSeriesChart.updateCanvasHeight();
            CZ.Common.updateLayout();
        }
        HomePageViewModel.showTimeSeriesChart = showTimeSeriesChart;

        function hideTimeSeriesChart() {
            CZ.leftDataSet = undefined;
            CZ.rightDataSet = undefined;
            $('#timeSeriesContainer').height(0);
            $('#timeSeriesContainer').hide();
            $('#vc').height('100%');
            CZ.Common.updateLayout();
        }
        HomePageViewModel.hideTimeSeriesChart = hideTimeSeriesChart;

        function updateTimeSeriesChart(vp) {
            var left = vp.pointScreenToVirtual(0, 0).x;
            if (left < CZ.Settings.maxPermitedTimeRange.left)
                left = CZ.Settings.maxPermitedTimeRange.left;
            var right = vp.pointScreenToVirtual(vp.width, vp.height).x;
            if (right > CZ.Settings.maxPermitedTimeRange.right)
                right = CZ.Settings.maxPermitedTimeRange.right;

            if (CZ.timeSeriesChart !== undefined) {
                var leftCSS = vp.pointVirtualToScreen(left, 0).x;
                var rightCSS = vp.pointVirtualToScreen(right, 0).x;
                var leftPlot = CZ.Dates.getYMDFromCoordinate(left).year;
                var rightPlot = CZ.Dates.getYMDFromCoordinate(right).year;

                CZ.timeSeriesChart.clear(leftCSS, rightCSS);
                CZ.timeSeriesChart.clearLegend("left");
                CZ.timeSeriesChart.clearLegend("right");

                var chartHeader = "TimeSeries Chart";

                if (CZ.rightDataSet !== undefined || CZ.leftDataSet !== undefined) {
                    CZ.timeSeriesChart.drawVerticalGridLines(leftCSS, rightCSS, leftPlot, rightPlot);
                }

                var screenWidthForLegend = rightCSS - leftCSS;
                if (CZ.rightDataSet !== undefined && CZ.leftDataSet !== undefined) {
                    screenWidthForLegend /= 2;
                }
                var isLegendVisible = CZ.timeSeriesChart.checkLegendVisibility(screenWidthForLegend);

                if (CZ.leftDataSet !== undefined) {
                    var padding = CZ.leftDataSet.getVerticalPadding() + 10;

                    var plotBottom = Number.MAX_VALUE;
                    var plotTop = Number.MIN_VALUE;

                    CZ.leftDataSet.series.forEach(function (seria) {
                        if (seria.appearanceSettings !== undefined && seria.appearanceSettings.yMin !== undefined && seria.appearanceSettings.yMin < plotBottom) {
                            plotBottom = seria.appearanceSettings.yMin;
                        }

                        if (seria.appearanceSettings !== undefined && seria.appearanceSettings.yMax !== undefined && seria.appearanceSettings.yMax > plotTop) {
                            plotTop = seria.appearanceSettings.yMax;
                        }
                    });

                    if ((plotTop - plotBottom) === 0) {
                        var absY = Math.max(0.1, Math.abs(plotBottom));
                        var offsetConstant = 0.01;
                        plotTop += absY * offsetConstant;
                        plotBottom -= absY * offsetConstant;
                    }

                    var axisAppearence = { labelCount: 4, tickLength: 10, majorTickThickness: 1, stroke: 'black', axisLocation: 'left', font: '16px Calibri', verticalPadding: padding };
                    var tickForDraw = CZ.timeSeriesChart.generateAxisParameters(leftCSS, rightCSS, plotBottom, plotTop, axisAppearence);
                    CZ.timeSeriesChart.drawHorizontalGridLines(tickForDraw, axisAppearence);
                    CZ.timeSeriesChart.drawDataSet(CZ.leftDataSet, leftCSS, rightCSS, padding, leftPlot, rightPlot, plotTop, plotBottom);
                    CZ.timeSeriesChart.drawAxis(tickForDraw, axisAppearence);

                    if (isLegendVisible) {
                        for (var i = 0; i < CZ.leftDataSet.series.length; i++) {
                            CZ.timeSeriesChart.addLegendRecord("left", CZ.leftDataSet.series[i].appearanceSettings.stroke, CZ.leftDataSet.series[i].appearanceSettings.name);
                        }
                    }

                    chartHeader += " (" + CZ.leftDataSet.name;
                }

                if (CZ.rightDataSet !== undefined) {
                    var padding = CZ.rightDataSet.getVerticalPadding() + 10;

                    var plotBottom = Number.MAX_VALUE;
                    var plotTop = Number.MIN_VALUE;

                    CZ.rightDataSet.series.forEach(function (seria) {
                        if (seria.appearanceSettings !== undefined && seria.appearanceSettings.yMin !== undefined && seria.appearanceSettings.yMin < plotBottom) {
                            plotBottom = seria.appearanceSettings.yMin;
                        }

                        if (seria.appearanceSettings !== undefined && seria.appearanceSettings.yMax !== undefined && seria.appearanceSettings.yMax > plotTop) {
                            plotTop = seria.appearanceSettings.yMax;
                        }
                    });

                    if ((plotTop - plotBottom) === 0) {
                        var absY = Math.max(0.1, Math.abs(plotBottom));
                        var offsetConstant = 0.01;
                        plotTop += absY * offsetConstant;
                        plotBottom -= absY * offsetConstant;
                    }

                    var axisAppearence = { labelCount: 4, tickLength: 10, majorTickThickness: 1, stroke: 'black', axisLocation: 'right', font: '16px Calibri', verticalPadding: padding };
                    var tickForDraw = CZ.timeSeriesChart.generateAxisParameters(rightCSS, leftCSS, plotBottom, plotTop, axisAppearence);
                    CZ.timeSeriesChart.drawHorizontalGridLines(tickForDraw, axisAppearence);
                    CZ.timeSeriesChart.drawDataSet(CZ.rightDataSet, leftCSS, rightCSS, padding, leftPlot, rightPlot, plotTop, plotBottom);
                    CZ.timeSeriesChart.drawAxis(tickForDraw, axisAppearence);

                    if (isLegendVisible) {
                        for (var i = 0; i < CZ.rightDataSet.series.length; i++) {
                            CZ.timeSeriesChart.addLegendRecord("right", CZ.rightDataSet.series[i].appearanceSettings.stroke, CZ.rightDataSet.series[i].appearanceSettings.name);
                        }
                    }

                    var str = chartHeader.indexOf("(") > 0 ? ", " : " (";
                    chartHeader += str + CZ.rightDataSet.name + ")";
                } else {
                    chartHeader += ")";
                }

                $("#timeSeriesChartHeader").text(chartHeader);
            }
        }
        HomePageViewModel.updateTimeSeriesChart = updateTimeSeriesChart;

        function ApplyFeatureActivation() {
            for (var idxFeature = 0; idxFeature < _featureMap.length; idxFeature++) {
                var feature = _featureMap[idxFeature];

                if (feature.IsEnabled === undefined) {
                    var enabled = true;
                    if (feature.Activation === 1 /* Disabled */) {
                        enabled = false;
                    }

                    if (feature.Activation === 3 /* NotRootCollection */ && HomePageViewModel.rootCollection) {
                        enabled = false;
                    }

                    if (feature.Activation === 2 /* RootCollection */ && !HomePageViewModel.rootCollection) {
                        enabled = false;
                    }

                    if (feature.Activation === 4 /* NotProduction */ && (constants && constants.environment && constants.environment === "Production")) {
                        enabled = false;
                    }

                    _featureMap[idxFeature].IsEnabled = enabled;
                }

                if (feature.JQueryReference) {
                    if (!_featureMap[idxFeature].IsEnabled) {
                        $(feature.JQueryReference).css("display", "none");
                    } else if (!_featureMap[idxFeature].HasBeenActivated) {
                        _featureMap[idxFeature].HasBeenActivated = true;
                        $(feature.JQueryReference).css("display", "block");
                    }
                }
            }
        }
    })(CZ.HomePageViewModel || (CZ.HomePageViewModel = {}));
    var HomePageViewModel = CZ.HomePageViewModel;
})(CZ || (CZ = {}));
