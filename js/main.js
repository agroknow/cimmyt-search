//enable hashbang URLs for html5mode
angular.module('HashBangURLs', []).config(['$locationProvider', function($location) {

}]);
angular.module("cimmytSearchApp", ['ngRoute', 'uiSwitch', 'rzModule'])
    //search app routes
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            $routeProvider.when('/search', {
                    controller: 'searchController',
                    templateUrl: 'templates/search.html'
                })
                .when('/search/:searchParam', {
                    controller: 'searchController',
                    templateUrl: 'templates/search.html'
                })
                .when('/search/:searchParam/:pageParam', {
                    controller: 'searchController',
                    templateUrl: 'templates/search.html'
                })
                .when('/', {
                    controller: 'mainController',
                    templateUrl: 'templates/bootstrap.html'
                });

            $locationProvider.html5Mode(true).hashPrefix('!');
        }
    ])
    //API invokation service 
    .factory('agrisApiCallFactory', function($http) {
        var factory = {

            getSearchData: function(query, page, facets, limit, arnQuery, typeQuery, sortValues, fromDate, toDate) {
                typeQuery = '&type=' + typeQuery;
                var facetStrings = {
                    types: "type",
                    authors: "author",
                    locations: "location",
                    subjects: "subject",
                    langs: "language"
                };

                if (!(Object.keys(facets).length === 0 && facets.constructor === Object)) {
                    facetParams = '';
                    for (facet in facets) {
                        if (facet != "type") {
                            i = 0;
                            initialized = false;
                            for (value in facets[facet]) {
                                if (facets[facet][value]) {
                                    if (!initialized) {
                                        facetParams += facetStrings[facet] + '=' + Object.keys(facets[facet])[i] + '';
                                        initialized = true;
                                    } else {
                                        facetParams += 'AND' + Object.keys(facets[facet])[i] + '';
                                    }

                                }
                                i++;
                            }
                            facetParams += '&';
                        }
                        if (facet == "types") {
                            typeQuery = '';
                        }


                    }
                } else {
                    facetParams = '';
                }
                if (sortValues) {
                    facetSort = '&facet.sort=index';
                } else {
                    facetSort = '&facet.count=index';
                }

                if (query == '*') {
                    queryString = '';
                } else {
                    // if (query.split(' ').length >= 2) {
                    // 	queryString = "freetext="+query;
                    // }
                    // else {
                    queryString = "keyword=" + query + "&entity-type=resource";
                    // }
                }



                facetParams = facetParams.slice(0, -1);
                if (fromDate != null || toDate != null) {
                    dateQuery = '&from=' + fromDate + '&to=' + toDate;
                } else {
                    dateQuery = '&from=1951&to=' + (new Date()).getFullYear();
                }

                fullQuery = "http://166.78.156.63:8080/cimmyt/search?" + queryString + "&page=" + page + "&format=json&" + typeQuery + facetParams + dateQuery;
                
                //console.log(fullQuery);

                return $http.get(fullQuery)
                    .then(function(response) {
                        var data = response.data;
                        console.log(data.results);
                        return data;
                    }, function(error) {
                        return 'error';
                    });
            }
        };
        return factory;
    })

    //pagination service
    .factory('PagerService', function() {
        // service definition
        var service = {};

        service.GetPager = GetPager;

        return service;

        // service implementation
        function GetPager(totalItems, currentPage, pageSize) {
            // default to first page
            currentPage = currentPage || 1;

            // default page size is 10
            pageSize = pageSize || 10;

            // calculate total pages
            var totalPages = Math.ceil(totalItems / pageSize);

            var startPage, endPage;
            if (totalPages <= 10) {
                // less than 10 total pages so show all
                startPage = 1;
                endPage = totalPages;
            } else {
                // more than 10 total pages so calculate start and end pages
                if (currentPage <= 6) {
                    startPage = 1;
                    endPage = 10;
                } else if (currentPage + 4 >= totalPages) {
                    startPage = totalPages - 9;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - 5;
                    endPage = currentPage + 4;
                }
            }

            // calculate start and end item indexes
            var startIndex = (currentPage - 1) * pageSize;
            var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

            // create an array of pages to ng-repeat in the pager control
            var pages = _.range(startPage, endPage + 1);

            // return object with all pager properties required by the view
            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        }
    })
    //tooltip directive
    .directive('tooltip', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                $(element).hover(function() {
                    // on mouseenter
                    $(element).tooltip('show');
                }, function() {
                    // on mouseleave
                    $(element).tooltip('hide');
                });
            }
        };
    })
    //transform facet machine names to appropriate values
    .filter('facetRename', function() {
        return function(input) {
            switch (input) {
                case 'types':
                    return 'Type';
                case 'langs':
                    return 'Language';
                case 'authors':
                    return 'Author(s)';
                case 'subjects':
                    return 'Subjects';
                default:
                    return 'Locations';

            }

        }
    })
    //resovle types to invoke the correct image
    .filter('typeResolve', function() {
        return function(input) {
            resourceTypes = ["Journal article", "Books and monographs", "Grey literature", "Annual report", "Guidelines and manuals", "Proceedings", "Report", "Brochures", "Reprint", "Presentation", "Poster", "Financial Statement", "Brochures & pamphlets", "Newsletter / Bulletin", "Fact sheets - Flyers", "Book ", "book chapter", "Article", "Special Pubs/Reports", "Research Plans", "Research Reports", "Bulletin", "Technical Bulletins", "JA", "Digital Material / CD-ROM", "Research Highlights", "RE", "Baseline survey", "Baseline Survey", "BK"];
            imageTypes = ["Photograph", "Image"];
            videoTypes = ["Video"];
            datasetTypes = ["Experimental data", "Experimental Data", "experimental data", "Survey data", "Phenotypic data", "Dataset", "genalocigal data", "Database", "Baseline Survey data", "Agronomy"];

            if (resourceTypes.indexOf(input) > -1 || resourceTypes.indexOf(input[0]) > -1) {
                return "doc";
            }
            if (imageTypes.indexOf(input) > -1) {
                return "img";
            }
            if (videoTypes.indexOf(input) > -1) {
                return "video";
            }
            if (datasetTypes.indexOf(input) > -1) {
                return "data";
            }

        }
    })
    //look-up language codes and replace them with full name
    .filter('facetValueLookup', function() {
        return function(input) {
            switch (input) {
                case 'eng':
                    return 'English';
                case 'ara':
                    return 'Arabic';
                case 'spa':
                    return 'Spanish';
                case 'fas':
                    return 'Persian';
                case 'deu':
                    return 'German';
                case 'jpn':
                    return 'Japanese';
                case 'rus':
                    return 'Russian';
                case 'fra':
                    return 'French';
                default:
                    return input;
            }
        }
    })
    //check if type element is an array or single object
    .filter('typeCardinalityCheck', function() {
        return function(input) {
            title = '';
            if (input.constructor === Array) {
                for (i in input) {
                    title += input[i] + ', ';
                }
                title = title.substring(0, title.length - 2);
            } else {
                return input;
            }

            return title;
        }
    })
    //check if title element is an array or single object
    .filter('titleCardinalityCheck', function() {
        return function(input) {
            title = '';
            if (input.constructor === Array) {

                title += input[0].value;
            } else {
                return input.value;
            }

            return title;
        }
    })
    //filter that capitalizes first letter of given strings
    .filter('capitalize', function() {
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    })
    //filter that removes unneeded full-stops from given strings
    .filter('normalize', function() {
        return function(input) {
            return input.replace(".", "");
        }
    })
    //filter cutting string and appending ellipsis
    .filter('cut', function() {
        return function(value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    //Also remove . and , so its gives a cleaner result.
                    if (value.charAt(lastspace - 1) == '.' || value.charAt(lastspace - 1) == ',') {
                        lastspace = lastspace - 1;
                    }
                    value = value.substr(0, lastspace);
                }
            }
            return value + " ...";
        };
    })

    //responsible for search.html
    .controller("searchController", function($rootScope, $scope, $location, $routeParams, agrisApiCallFactory, PagerService) {
        $rootScope.selectedFacets = {};
        $scope.parseInt = parseInt;
        $scope.facetLimit = 20;
        $rootScope.arnQuery = '';
        $scope.previousYear = parseInt(new Date().getFullYear()) - 1;

        //redirect to internal .php file
        $scope.redirect = function(id) {
            if ($location.absUrl().indexOf('/cimmyt/') !== -1) {
            	window.location.href = '/cimmyt/item/' + id;
            }
            else {
            	window.location.href = '/item/' + id;
            }
        }
        //checks if URL points to a valid thumbnail
        $scope.isValid = function(url) {
            return /(.[a-z]{3,3}.jpg)/.test(url);
        }

        //returns URL of valid thumbnail
        $scope.getThumb = function(shownBy) {
            for (obj in shownBy) {
                if (/(.[a-z]{3,3}.jpg)/.test(shownBy[obj].value)) {
                    return shownBy[obj].value;
                }
            }
        }

        $scope.isArray = angular.isArray;

        $scope.setSearchParameters = function() {

            dateQueryStarted = false;
            dateQueryCompleted = false;


            //if page arguments are set, activate the respective facets
            if (JSON.stringify($rootScope.selectedFacets) == JSON.stringify({})) {

                for (i in Object.keys($routeParams)) {
                    param = Object.keys($routeParams)[i];
                    if (param != "searchParam" && param != "pageParam" && param != "from" && param != "to" && param != "dataParam") {
                        paramValue = $routeParams[param];
                        if (paramValue.indexOf(",") != -1) {
                            values = paramValue.split(",");
                            facets = '{'
                            for (i in values) {
                                facets += '"' + values[i] + '":true,';
                            }
                            facets = facets.substring(0, facets.length - 1) + '}';
                            $rootScope.selectedFacets[param] = JSON.parse(facets);
                        } else {
                            $rootScope.selectedFacets[param] = JSON.parse('{ "' + paramValue + '": true }');
                        }
                    }
                }
            } else {
                //if facets are chosen, override search parameters
                $location.path();
                for (facet in $rootScope.selectedFacets) {
                    i = 0;
                    deActivated = true;
                    params = '';
                    for (value in $rootScope.selectedFacets[facet]) {
                        if ($rootScope.selectedFacets[facet][value]) {
                            deActivated = false;
                            params += Object.keys($rootScope.selectedFacets[facet])[i] + ',';
                        }
                        i++;
                    }
                    //check if facet has "false" as value
                    if (!deActivated) {
                        $location.search(facet, params.substring(0, params.length - 1));
                    } else {

                        $location.search(facet, null);
                    }
                }
            }
            $location.search("from", $rootScope.slider.minValue);
            $location.search("to", $rootScope.slider.maxValue);
        }

        //called every time an individual "type" item is selected
        $scope.unsetAll = function() {
            $rootScope.types.all = false;
        }

        $scope.isFacetActivated = function(facet) {
            for (i in $rootScope.selectedFacets[facet]) {
                if ($rootScope.selectedFacets[facet][i]) {
                    $rootScope.searchPerformed = true;
                    return true;
                }
            }
            return false;
        }


        $scope.searchSubmit = function() {
            $scope.searchLoading = true;
            $scope.facetLoading = true;


            if ($routeParams.searchParam) {

                if ($routeParams.type) {

                    types = $routeParams.type.split(",");
                    $rootScope.selectedTypes = $routeParams.type;
                    $rootScope.typeQuery = '';

                    //build the types query based on URL parameters
                    for (i in types) {
                        switch (types[i]) {
                            case 'publications':
                                $rootScope.types.publications = true;
                                $rootScope.typeQuery += 'Journal articleORBooks and monographsORGrey literatureORVideoORAnnual reportORGuidelines and manualsORProceedingsORReportORBrochuresOrORReprintORPresentationORPosterORFinancial StatementORBrochures & pamphletsORNewsletter / BulletinORFact sheets - FlyersORBook ORbook chapterORArticleORSpecial Pubs/ReportsORResearch PlansORResearch ReportsORBulletinORTechnical BulletinsORJAORDigital Material / CD-ROMORResearch HighlightsORREORBaseline surveyORBaseline SurveyORBKOR';
                                break;
                            case 'photographs':
                                $rootScope.types.photographs = true;
                                $rootScope.typeQuery += 'PhotographORImageOR';
                                break;
                            case 'videos':
                                $rootScope.types.videos = true;
                                $rootScope.typeQuery += 'VideoOR';
                                break;
                            case 'datasets':
                                $rootScope.types.datasets = true;
                                $rootScope.typeQuery += 'Experimental dataORExperimental DataORexperimental dataORSurvey dataORPhenotypic dataORDatasetORgenalocigal dataORDatabaseORBaseline Survey dataORAgronomyOR';
                                break;
                            default:
                                $rootScope.types.publications = true;
                                $rootScope.types.photographs = true;
                                $rootScope.types.videos = true;
                                $rootScope.types.datasets = true;
                                $rootScope.typeQuery = 'Journal articleORBooks and monographsORGrey literatureORVideoORAnnual reportORGuidelines and manualsORProceedingsORReportORBrochuresOrORReprintORPresentationORPosterORFinancial StatementORBrochures & pamphletsORNewsletter / BulletinORFact sheets - FlyersORBook ORbook chapterORArticleORSpecial Pubs/ReportsORResearch PlansORResearch ReportsORBulletinORTechnical BulletinsORJAORDigital Material / CD-ROMORResearch HighlightsORREORBaseline surveyORBaseline SurveyORBKORPhotographORImageORVideoORExperimental dataORExperimental DataORexperimental dataORSurvey dataORPhenotypic dataORDatasetORgenalocigal dataORDatabaseORBaseline Survey dataORAgronomyOR';
                        }
                    }
                    $rootScope.typeQuery = $rootScope.typeQuery.substring(0, $rootScope.typeQuery.length - 2);

                } else {
                    $rootScope.typeQuery = 'Journal articleORBooks and monographsORGrey literatureORVideoORAnnual reportORGuidelines and manualsORProceedingsORReportORBrochuresOrORReprintORPresentationORPosterORFinancial StatementORBrochures & pamphletsORNewsletter / BulletinORFact sheets - FlyersORBook ORbook chapterORArticleORSpecial Pubs/ReportsORResearch PlansORResearch ReportsORBulletinORTechnical BulletinsORJAORDigital Material / CD-ROMORResearch HighlightsORREORBaseline surveyORBaseline SurveyORBKORPhotographORImageORVideoORExperimental dataORExperimental DataORexperimental dataORSurvey dataORPhenotypic dataORDatasetORgenalocigal dataORDatabaseORBaseline Survey dataORAgronomyOR';
                }

                //get the query from route or the URL if defined 
                if ($rootScope.query != $routeParams.searchParam && $rootScope.query != '') {
                    $location.path("/search/" + $rootScope.query + '/0');
                } else {
                    $rootScope.query = $routeParams.searchParam;
                    $scope.token = $rootScope.query;
                    q = $rootScope.query;
                }
            }

            //search for all if no query is defined - currently unsupported
            if ($rootScope.query == '') {
                $scope.token = '*';
                q = '*';
            } else {
                $scope.token = $rootScope.query;
                q = $rootScope.query;
            }
            //if no URL parameter for paging is defined, default to the first page (0)
            if ($routeParams.pageParam != undefined) {

                $scope.currentPage = $routeParams.pageParam;
            } else {
                $scope.currentPage = 0;
            }
            //get page parameter to pass unto URLs of future calls
            if ($routeParams.pageParam != undefined) {
                $rootScope.currentPage = parseInt($routeParams.pageParam);
            }

            //look for facets and/or page arguments
            $scope.setSearchParameters();


            //set current URL for redirection during back click 
            $rootScope.currentUrl = $location.path();


            //find current url parameters to pass unto the pagination buttons
            $rootScope.currentUrlParams = '';
            for (i in Object.keys($location.search())) {
                $scope.currentUrlParams += Object.keys($location.search())[i] + '=' + $location.search()[Object.keys($location.search())[i]] + '&';
            }
            $rootScope.currentUrlParams = encodeURI($scope.currentUrlParams.substring(0, $scope.currentUrlParams.length - 1));

            $rootScope.dataType = 'active';

            //scrollbar properties
            $rootScope.config = {
                autoHideScrollbar: true,
                theme: 'minimal-dark',
                advanced: {
                    updateOnContentResize: true
                },
                setHeight: 200,
                scrollInertia: 0
            }

            //invoke search service
            agrisApiCallFactory.getSearchData(q, $rootScope.currentPage, $rootScope.selectedFacets, $scope.facetLimit, $rootScope.arnQuery, $rootScope.typeQuery, $scope.sortByValues, $rootScope.slider.minValue, $rootScope.slider.maxValue).then(function(data) {

                if (data != 'error') {
                    $scope.items = data.results;
                    $scope.total = data.total;
                    $scope.pages = Array(Math.ceil($scope.total / 10));
                    $scope.facets = data.facets;
                    $scope.fid = '';
                    $scope.currentFacetPage = 0;
                    $scope.pager = PagerService.GetPager($scope.items, $rootScope.currentPage);
                    $scope.searchLoading = false;
                    $scope.facetData = data.facets;
                }

            }, function(msg) {
                alert(msg);
            });


        }


    })

    //responsible for bootstrap.html
    .controller("mainController", function($rootScope, $scope, $location, $routeParams, agrisApiCallFactory, $http) {

        $rootScope.types = {
            publications: false,
            videos: false,
            photographs: false,
            datasets: false,
            all: true
        };

        $scope.setAllTypes = function() {
            if ($rootScope.types.all) {
                $rootScope.types = {
                    publications: true,
                    videos: true,
                    photographs: true,
                    datasets: true,
                    all: true
                };
            } else {
                $rootScope.types = {
                    publications: false,
                    videos: false,
                    photographs: false,
                    datasets: false,
                    all: false
                };
            }
        };

        //if all types are selected, auto-select "All"
        $scope.unsetAllTypes = function() {
            if ($rootScope.types.publications && $rootScope.types.videos && $rootScope.types.photographs && $rootScope.types.datasets) {
                $rootScope.types.all = true;
            } else {
                $rootScope.types.all = false;
            }

        }

        //initialize date, paging and initial query
        $scope.initParams = function() {

            $rootScope.date = (new Date()).getFullYear();
            //check if a date-range query has been submitted through the URL
            if ($routeParams.from && $routeParams.to) {
                $rootScope.yearFrom = parseInt($routeParams.from);
                $rootScope.yearTo = parseInt($routeParams.to);
            } else {
                $rootScope.fromYear = 1951;
                var d = new Date();
                $rootScope.toYear = parseInt(d.getFullYear());
            }

            //set initial slider values
            $rootScope.slider = {
                minValue: 1951,
                maxValue: (new Date()).getFullYear(),
                options: {
                    floor: 1951,
                    ceil: (new Date()).getFullYear(),
                    step: 1
                }
            };

            $rootScope.currentPage = '0';
            $rootScope.query = '';



        }

        //calls initial search function
        $rootScope.startSearch = function() {
            typeParam = '';
            if (!$rootScope.types.all) {
                for (type in $rootScope.types) {
                    if ($rootScope.types[type]) {
                        typeParam += type + ',';
                    }
                }
                typeParam = typeParam.substring(0, typeParam.length - 1);
            } else {
                typeParam = 'publications,photographs,datasets,videos';
            }
            $location.path('/search/' + $rootScope.query).search({
                "type": typeParam
            });

        }
    });