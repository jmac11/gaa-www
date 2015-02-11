'use strict';

angular.module('wwwApp')
  .controller('MainCtrl', ['$scope', '$http', 'focus', function ($scope, $http, focus) {

    $scope.google_defined = typeof(google) != 'undefined';

    $scope.domain = 'http://gaa.propertyharbor.com'

    $scope.fields = [
      'CC_1',
      'CC_2',
      'ENGTYPE4',
      'ENGTYPE_1',
      'ENGTYPE_2',
      'ENGTYPE_3',
      'ENGTYPE_4',
      'ENGTYPE_5',
      'HASC_1',
      'HASC_2',
      'HASC_3',
      'ID_0',
      'ID_1',
      'ID_2',
      'ID_3',
      'ID_4',
      'ID_5',
      'ISO',
      'NAME_0',
      'NAME_1',
      'NAME_2',
      'NAME_3',
      'NAME_4',
      'NAME_5',
      'NL_NAME_1',
      'NL_NAME_2',
      'NL_NAME_3',
      'OBJECTID',
      'REMARKS_1',
      'REMARKS_2',
      'REMARKS_3',
      'REMARKS_4',
      'Shape_Area',
      'Shape_Leng',
      'TYPE4',
      'TYPE_1',
      'TYPE_2',
      'TYPE_3',
      'TYPE_4',
      'TYPE_5',
      'VALIDFR_1',
      'VALIDFR_2',
      'VALIDFR_3',
      'VALIDFR_4',
      'VALIDTO_1',
      'VALIDTO_2',
      'VALIDTO_3',
      'VALIDTO_4',
      'VARNAME_1',
      'VARNAME_2',
      'VARNAME_3',
      'VARNAME_4',
    ];

    $scope.filter_attrs = {order_by: [{field: 'NAME_0', direction: 'asc'}]};
    $scope.filter_attrs.filters = [];

    $scope.$watch('filter_attrs', function(val){
      $scope.jsonified_filter_attrs = encodeURI(angular.toJson(val));
    }, true);

    $scope.new_filter = function(name, op, val){
      $scope.filter_attrs.filters.push({name: name, op: op, val: val});
    };

    $scope.res1 = {};
    $scope.res2 = {};

    $scope.x = 37.6403294226059089;
    $scope.y = 0.2386290558437831;
    $scope.r = 1;
    $scope.m = 100;

    $scope.execute1 = function(){
      $http.get('/api/v1/layer_feature?page=1&q='+$scope.jsonified_filter_attrs).success(function(res){
        $scope.res1 = res;
        //focus('pass');
      });
    };

    $scope.remove_filter = function(index){
      $scope.filter_attrs.filters.splice(index, 1);

    }

    $scope.execute2 = function(){
      $http.get('/api/v1/layer_feature/x/'+$scope.x+'/y/'+$scope.y+'/r/'+$scope.r+'/m/'+$scope.m).success(function(res){
        $scope.res2 = res;
        //focus('pass');
      });
    };

    $scope.new_filter('NAME_2', '==', 'Nairobi');


  }]);
