angular.module('starter.controllers.Offer', [])

.controller('OfferCtrl', function($scope, $ionicModal, $ionicLoading, $log, $http, $ionicSlideBoxDelegate, $cordovaEmailComposer, CONFIG) {
	$scope.sendNewComment = function() {		
		var comment = $scope.offerData.newComment;
		
		console.log(comment);
		
		var toSend = {
			message: $scope.offerData.newComment
		}
		
		var req = {
			method: 'POST',
			url: CONFIG.serverUrl + 'api/offres/discussion/' + $scope.modalData.Id,
			headers: {
			'content-type': 'application/json',
			'accept': 'application/json'
			},
			data: toSend
		}
		
		$http(req).then(function(dataServer){
			$scope.modalData.Discussion.push(dataServer);
			
			$scope.offerData.newComment = '';
		}, function(data){
			console.log("Problème d'envoi de la requête.");
			//alert( "Problème d'envoi au serveur: " + JSON.stringify({data: data}));
		});
		
		
	}
	
	$scope.composeMail = function() {
		$scope.offerData.allowMailComposing = true;
		
		var urischeme = 'email'
		
		cordova.plugins.email.isAvailable(urischeme,
		function (isAvailable, withScheme) {
			alert('Service is not available : ' + isAvailable + ' ; ' + withScheme) //unless isAvailable;
		}
);
	}
	
	$scope.sendMail = function() {
		var email = {
			to: 'jerome.guidon@insa-lyon.fr',
			//cc: 'erika@mustermann.de',
			//bcc: ['john@doe.com', 'jane@doe.com'],
			attachments: [],
			//subject: '[Givebox] Votre offre \" ' + $scope.modalData.Titre + '\" ',
			subject: '[Givebox] Votre offre',
			//body: $scope.offerData.mailContent,
			body: 'mailContent',
			isHtml: false,
		};

		cordova.plugins.email.open(email,function() {
			console.log('email view dismissed');
		}, this);
	}
	
	$scope.deleteMail = function() {
		$scope.offerData.allowMailComposing = false;
		$scope.offerData.mailContent = '';
	}
	
	$scope.next = function() {
		$ionicSlideBoxDelegate.next();
	};
	
	$scope.formatDate = function(date) {
// 		var toReturn = '';		
		///2016-03-17T18:01:42.663
		var months = [
			'Janvier',
			'Février',
			'Mars',
			'Avril',
			'Mai',
			'Juin',
			'Juillet',
			'Août',
			'Septembre',
			'Octobre',
			'Novembre',
			'Décembre'
		]
		
		var strMonth = date.substring(5,7);
		var month = months[_.parseInt(strMonth-1)];
		
		return "le " + date.substring(8,10) + " " + month + " " + date.substring(0,4) + " à " + date.substring(11,13) + "h" + date.substring(14,16);
	}
	
	$scope.previous = function() {
		$ionicSlideBoxDelegate.previous();
	};
});
