'use strict';

angular.module('dnord.gmapLocationsMap', [])
  .directive('gmapLocationsMap', function ($rootScope) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
	locations: '=',
	clickFunction: '&'
      },
      template: '<div><div class="map2" id="{{mapid}}"></div></div>',
      link: function(scope, element, attrs) {
	var mapOptions = {
	  zoom: 12,
	  center: new google.maps.LatLng(-26.0833, 28.2500),
	  mapTypeId: google.maps.MapTypeId.ROADMAP,
	  scrollwheel: true,
	  disableDefaultUI: true,
	  zoomControl: true
	};

	if(attrs.zoom && parseInt(attrs.zoom))
	  mapOptions.zoom = parseInt(attrs.zoom);
	if(attrs.center){
	  var center = scope.$eval(attrs.center);
	  if(parseFloat(center.lat) && parseFloat(center.lon))
	    mapOptions.center = new google.maps.LatLng(parseFloat(center.lat), parseFloat(center.lon));
	}

	if(attrs.maptype){
	  switch(attrs.maptype.toLowerCase()){
	    case 'hybrid':
	      mapOptions.mapTypeId = google.maps.MapTypeId.HYBRID;
	    break;
	    case 'roadmap':
	      mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
	    break;
	    case 'satellite':
	      mapOptions.mapTypeId = google.maps.MapTypeId.SATELLITE;
	    break;
	    case 'terrain':
	      mapOptions.mapTypeId = google.maps.MapTypeId.TERRAIN;
	    break;
	    default:
	      mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
	    break;
	  }
	}

	if(attrs.scrollwheel){
	  switch(attrs.scrollwheel.toLowerCase()){
	    case 'true':
	      mapOptions.scrollwheel = true;
	    break;
	    case 'false':
	      mapOptions.scrollwheel = false;
	    break;
	    default:
	      mapOptions.scrollwheel = true;
	    break;
	  }
	}

        var selectedColor = '#1E90FF',
        selectedShape;

        var map = new google.maps.Map(element.find('div')[0], mapOptions);
        var overlays = [];

        var gbounds = new google.maps.LatLngBounds(),
        blatLng;

        function extendMapBounds(geom){
          if (typeof(geom) !== 'undefined' && geom !== null){
            geom.forEach(function(mapInfo, index){
              blatLng = new google.maps.LatLng(mapInfo[1], mapInfo[0]);
              gbounds.extend(blatLng);
            });
          }
        }

        function setMapPolygon(location){
          //disabled deleteSelectedShape();
          var coords = [],
          latLng,
          overlay,
          bounds;

          var label_options = {
            boxStyle: {
              background: "#FFFFFF"
            },
            boxClass: "infobox",
            disableAutoPan: true,
            pixelOffset: new google.maps.Size(-58, -54, 'px', 'px'),
            closeBoxURL: "",
            isHidden: false,
            pane: "floatPane",
            enableEventPropagation: true
          };


          // used to track the bounds
          bounds = new google.maps.LatLngBounds();
          if (location.geom != null){

            location.geom.forEach(function(mapInfo, index){
              latLng = new google.maps.LatLng(mapInfo[1], mapInfo[0]);
              bounds.extend(latLng);
              coords.push(latLng);
            });

            label_options.content = '<pre>' + location.NAME_0 + '\n'+ location.NAME_1 + '\n'+ location.NAME_2 + '\n'+ location.NAME_3 + '\n'+ location.NAME_4 + '\n'+ '</pre>';

            // get the center of the bounds for the location of the label
            var poly_center = bounds.getCenter();

            // place the infobox in a better position
            var lat = parseFloat(poly_center.lat()),
            lng = parseFloat(poly_center.lng());

            label_options.position = new google.maps.LatLng(lat, lng);

            overlay = new google.maps.Polygon({
              paths: coords,
              // strokeWeight: 0,
              // fillOpacity: 0.45,
              editable: false,
              strokeColor: "#25677C",
              strokeOpacity: 0.8,
              strokeWeight: 1.0,
              fillColor: "#77B7CC",
              fillOpacity: 0.25,
              label_box: new InfoBox(label_options),
            });

            overlays.push(overlay);

            //disabled overlayClickListener(overlay);
            //setSelection(overlay);
            overlay.setMap(map);
            // drawingManager.drawingControlOptions.drawingModes = [];
            // drawingManager.setDrawingMode(null);

            google.maps.event.addListener(overlay, 'click', function (event) {
              scope.clickFunction()(location);
              console.info('Click event', location);
            });
            google.maps.event.addListener(overlay, 'mouseover', function (event) {
              // change some of the price label options to mark them out better
              label_options.boxStyle.background = '#FFFFFF';

              if (!this.active) {
                this.set('fillColor', '#FFD700');
              }

              this.label_box.open(map);
            });

            google.maps.event.addListener(overlay, 'mouseout', function (event) {
              if (!this.active) {
                this.set('fillColor', '#77B7CC');
              }
              this.label_box.close();
            });
          }
        }

        function clearOverlays(){
          overlays.forEach(function(overlay){
            overlay.setMap(null);
          });
          overlays = [];
        }

        scope.$watch('locations', function(locations) {
          if (locations != undefined && locations != null && locations.objects != undefined){
            clearOverlays();
            gbounds = new google.maps.LatLngBounds();
            locations.objects.forEach(function(location){
              setMapPolygon(location);
              extendMapBounds(location.geom);
            });
            map.fitBounds(gbounds);
          }
        });

      }
    };
  });
