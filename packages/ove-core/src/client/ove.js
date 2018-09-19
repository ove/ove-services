/*
 * ove.js v@VERSION
 * https://github.com/dsi-icl/ove
 *
 * Copyright (c) @AUTHOR
 * Released under @LICENSE License
 */
//-- IMPORTANT: all code comments must be in this format. --//
function OVE () {
    var getHostName = function (withScheme) {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src.indexOf('ove.js') > 0) {
                return scripts[i].src.substr(
                    withScheme ? 0 : scripts[i].src.indexOf('//') + 2,
                    scripts[i].src.lastIndexOf('/') - (withScheme ? 0 : scripts[i].src.indexOf('//') + 2));
            }
        }
    };

    //-----------------------------------------------------------//
    //--                 Messaging Functions                   --//
    //-----------------------------------------------------------//
    var getSocket = function (_private) {
        var onMessage = function (appId, message) { return 0; };

        //-- Socket init code --//
        var wsUrl = 'ws://' + getHostName(false) + '/';
        var ws = new WebSocket(wsUrl);
        ws.addEventListener('error', function (m) {
            console.error(m);
        });
        ws.addEventListener('open', function (m) {
            if (DEBUG) {
                console.log('websocket connection made with ' + wsUrl);
            }
        });
        ws.addEventListener('message', function (m) {
            if (DEBUG) {
                console.log(m.data);
            }
            var data = JSON.parse(m.data);
            if (data.appId && (!data.sectionId || data.sectionId == _private.sectionId)) {
                onMessage(data.appId, data.message);
            }
        });

        //-- SDK functions --//
        this.on = function (func) {
            onMessage = func;
        };
        this.send = function (appId, message) {
            if (_private.sectionId) {
                ws.send(JSON.stringify({ appId: appId, sectionId: _private.sectionId, message: message }));
            } else {
                ws.send(JSON.stringify({ appId: appId, message: message }));
            }
        };
    };

    //-----------------------------------------------------------//
    //--                   Layout Variables                    --//
    //-----------------------------------------------------------//
    var setLayout = function (_self, _private) {
        _self.layout = {};
        var fetchSection = function (sectionId) {
            if (sectionId) {
                if (DEBUG) {
                    console.log('requesting details of section: ' + sectionId);
                }
                fetch(getHostName(true) + '/section/' + sectionId)
                    .then(function (r) { return r.text(); }).then(function (text) {
                        var section = JSON.parse(text);
                        _self.layout.section = { w: section.w, h: section.h };
                        _self.state.name = new URLSearchParams(location.search.slice(1)).get('state') || section.state;
                        _private.sectionId = section.id;
                        if (DEBUG) {
                            console.log('got details from section: ' + section.id);
                        }
                        $(document).trigger('ove.loaded');
                    });
            }
        };
        var id = new URLSearchParams(location.search.slice(1)).get('oveClientId');
        //-- cliendId will not be provided by a controller --//
        if (!id) {
            fetchSection(new URLSearchParams(location.search.slice(1)).get('oveSectionId'));
            return;
        }
        var sectionId = id.substr(id.lastIndexOf('.') + 1);
        id = id.substr(0, id.lastIndexOf('.'));
        if (!id && sectionId) {
            //-- sectionId has not been provided as a part of oveClientId  --//
            //-- oveClientId has the format "{space}-{client}.{sectionId}" --//
            //-- the ".{sectionId}" portion is optional and can be omitted --//
            id = sectionId;
            sectionId = new URLSearchParams(location.search.slice(1)).get('oveSectionId');
        }
        var client = id.substr(id.lastIndexOf('-') + 1);
        var space = id.substr(0, id.lastIndexOf('-'));

        //-- call APIs /clients or /client/{sectionId}  --//
        fetch(getHostName(true) + '/client' + (sectionId ? '/' + sectionId : 's'))
            .then(function (r) { return r.text(); }).then(function (text) {
                _self.layout = (JSON.parse(text)[space] || [])[client] || {};
                fetchSection(sectionId);
            });
    };

    //-----------------------------------------------------------//
    //--            Shared State and Local Context             --//
    //-----------------------------------------------------------//
    var getState = function (_private) {
        this.cache = function (url) {
            $.ajax({ url: url || (_private.sectionId + '/state'), type: 'POST', data: JSON.stringify(this.current), contentType: 'application/json' });
        };
        this.load = function (url) {
            var _self = this;
            return new Promise(function (resolve, reject) {
                $.get(url || (_private.sectionId + '/state')).done(function (state) {
                    if (state) {
                        _self.current = state;
                        resolve('state loaded');
                    }
                });
            });
        };
        this.current = {};
        this.name = undefined;
    };

    this.context = {
        uuid: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        })
    };

    //-- holds private data within OVE library --//
    var _private = {};
    this.socket = new getSocket(_private);
    this.state = new getState(_private);
    setLayout(this, _private);
}