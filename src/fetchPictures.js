const axios = require('axios').default;
export function fetchPicture(request, page) {
  return axios
    .get(
      `https://pixabay.com/api/?key=29111135-c68df28752f5bff5a67727daa&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    )
    .then(response => {
      page += 1;
      return response;
    })
    .catch(error => {
      if (error.response) {
        throw new Error(error.response.status);
      }
    });
}
