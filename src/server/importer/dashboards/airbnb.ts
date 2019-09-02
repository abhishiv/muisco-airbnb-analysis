export default {
  id: "airbnb",
  defaultQueryVariables: {
    cityName: "berlin",
    roomType: "Entire home/apt",
    from: "2014-08-01",
    to: "2018-01-30"
  },
  meta: {
    roomType: ["Entire home/apt", "Shared room", "Private room"],
    cities: [
      {
        id: "milano",
        name: "milano",
        topography:
          "http://data.insideairbnb.com/italy/lombardy/milan/2019-07-12/visualisations/neighbourhoods.geojson",
        dataset: [
          "http://localhost:5000/_data/airbnb/italy/lombardy/milan/2019-07-12/visualisations/reviews.csv",
          "http://localhost:5000/_data/airbnb/italy/lombardy/milan/2019-07-12/visualisations/listings.csv"
        ]
      },
      {
        id: "berlin",
        name: "berlin",
        topography:
          "http://data.insideairbnb.com/germany/be/berlin/2019-07-11/visualisations/neighbourhoods.geojson",
        dataset: [
          "http://localhost:5000/_data/airbnb/germany/be/berlin/2019-07-11/visualisations/reviews.csv",
          "http://localhost:5000/_data/airbnb/germany/be/berlin/2019-07-11/visualisations/listings.csv"
        ]
      }
    ]
  }
};
