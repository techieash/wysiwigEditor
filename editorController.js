var app = angular.module('app', ['Wysiwig'])

app.controller('EditorCtrl', function($scope) {
	$scope.editorConfig = {
		fontAwesome: true
	};
	$scope.editorApi = {
		scope: $scope
	};
})