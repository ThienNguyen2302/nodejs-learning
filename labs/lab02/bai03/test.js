let url = "/students/123x///"


let pattern = /\/students\/[a-zA-Z0-9]+\/*$/ig

console.log(url.match(pattern))