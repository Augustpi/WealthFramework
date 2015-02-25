﻿(function () {
    'use strict';

    var controllerId = 'chapter0Controller';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService', 'userService', '$scope', '$timeout', '$rootScope', 'logger', chapter0Controller]);

    function chapter0Controller(resourcePoolService, userService, $scope, $timeout, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;

        initialize();

        /* Implementations */

        function initialize() {

            initializeIntroduction();
            initializeBasics();
            initializeSectorIndex();
            initializeKnowledgeIndex();

            function initializeIntroduction() {

                vm.introduction_UPOResourcePoolId = 1;

                // Initial start
                var increaseMultiplierTimeoutInitial = $timeout(increaseMultiplier, 5000);
                var increaseMultiplierTimeoutRecursive = null;

                function increaseMultiplier() {

                    // Call the service to increase the multiplier
                    resourcePoolService.getResourcePoolCustomEdit(vm.introduction_UPOResourcePoolId)
                        .then(function (resourcePoolSet) {
                            userService.getUserInfo()
                                .then(function (userInfo) {
                                    var resourcePool = resourcePoolSet[0];
                                    resourcePool.currentUserId = userInfo.Id;

                                    for (var i = 0; i < resourcePool.ElementSet.length; i++) {
                                        var element = resourcePool.ElementSet[i];
                                        element.increaseMultiplier(resourcePool.currentUserId);
                                    }
                                });
                        });

                    // Then increase recursively
                    // TODO Decrease this timeout interval
                    var increaseMultiplierTimeoutRecursive = $timeout(increaseMultiplier, 100000);
                }

                // When the DOM element is removed from the page,
                // AngularJS will trigger the $destroy event on
                // the scope. This gives us a chance to cancel any
                // pending timer that we may have.
                $scope.$on("$destroy", function (event) {
                    $timeout.cancel(increaseMultiplierTimeoutInitial);
                    $timeout.cancel(increaseMultiplierTimeoutRecursive);
                });
            }

            function initializeBasics() {

                var basics_updatingOpposite = false; // To prevent recursive update
                vm.basics_ExistingModelResourcePoolId = 2;
                vm.basics_NewModelResourcePoolId = 3;

                // Listen resource pool updated event
                $rootScope.$on('element_multiplierIncreased', updateOppositeResourcePool);
                $rootScope.$on('element_multiplierDecreased', updateOppositeResourcePool);
                $rootScope.$on('element_multiplierReset', updateOppositeResourcePool);

                function updateOppositeResourcePool(event, element) {

                    if (element.ResourcePool.Id === vm.basics_ExistingModelResourcePoolId
                        || element.ResourcePool.Id === vm.basics_NewModelResourcePoolId) {

                        if (basics_updatingOpposite) {
                            basics_updatingOpposite = false;
                            return;
                        } else {
                            basics_updatingOpposite = true;

                            var oppositeResourcePoolId = element.ResourcePool.Id === vm.basics_ExistingModelResourcePoolId
                                ? vm.basics_NewModelResourcePoolId
                                : vm.basics_ExistingModelResourcePoolId;

                            // Call the service to increase the multiplier
                            resourcePoolService.getResourcePoolCustomEdit(oppositeResourcePoolId)
                                .then(function (resourcePoolSet) {
                                    userService.getUserInfo()
                                        .then(function (userInfo) {
                                            var resourcePool = resourcePoolSet[0];
                                            resourcePool.currentUserId = userInfo.Id;

                                            for (var i = 0; i < resourcePool.ElementSet.length; i++) {
                                                var element = resourcePool.ElementSet[i];
                                                switch (event.name) {
                                                    case 'element_multiplierIncreased': { element.increaseMultiplier(resourcePool.currentUserId); break; }
                                                    case 'element_multiplierDecreased': { element.decreaseMultiplier(resourcePool.currentUserId); break; }
                                                    case 'element_multiplierReset': { element.resetMultiplier(resourcePool.currentUserId); break; }
                                                }
                                            }
                                        });
                                });
                        }
                    }
                }
            }

            function initializeSectorIndex() {
                vm.sectorIndex_SampleResourcePoolId = 4;
            }

            function initializeKnowledgeIndex() {

                vm.knowledgeIndex_OldSystemChartConfig = null;
                vm.knowledgeIndex_NewSystemChartConfig = null;
                vm.knowledgeIndex_SampleResourcePoolId = 5;
                vm.knowledgeIndex_PopuplarSoftwareLicensesResourcePoolId = 6;
                var timeoutInitial = $timeout(refreshPage, 5000);
                var timeoutRecursive = null;

                // When the DOM element is removed from the page,
                // AngularJS will trigger the $destroy event on
                // the scope. This gives us a chance to cancel any
                // pending timer that we may have.
                $scope.$on("$destroy", function (event) {
                    $timeout.cancel(timeoutInitial);
                    $timeout.cancel(timeoutRecursive);
                });

                vm.knowledgeIndex_OldSystemChartConfig = {
                    title: {
                        text: ''
                    },
                    options: {
                        chart: {
                            type: 'column',
                            height: 358
                        },
                        yAxis: {
                            title: { text: 'Development process' },
                            min: 0,
                            allowDecimals: false
                        },
                        xAxis: { categories: ['Knowledge'] },
                        plotOptions: {
                            column: {
                                pointWidth: 15
                            }
                        }
                    },
                    series: [
                        { name: "My Precious Jewelry", data: [0] },
                        { name: 'Death Star Architecture', data: [0] },
                        { name: "Christina's Secret", data: [0] },
                        { name: 'Nuka Cola Formula', data: [0] }
                    ]
                };

                vm.knowledgeIndex_NewSystemChartConfig = {
                    title: {
                        text: ''
                    },
                    options: {
                        chart: {
                            type: 'column',
                            height: 300
                        },
                        yAxis: {
                            title: { text: 'Development process' },
                            min: 0,
                            allowDecimals: false
                        },
                        xAxis: { categories: ['Knowledge'] },
                        plotOptions: {
                            column: {
                                pointWidth: 15
                            }
                        }
                    },
                    series: [
                        { name: 'Global Knowledge Database', data: [0] }
                    ]
                };

                function refreshPage() {

                    var organizationIndex = Math.floor(Math.random() * 4);
                    vm.knowledgeIndex_OldSystemChartConfig.series[organizationIndex].data[0] += 1;
                    vm.knowledgeIndex_NewSystemChartConfig.series[0].data[0] += 1;

                    timeoutRecursive = $timeout(refreshPage, 1000);
                }
            }
        }
    };
})();