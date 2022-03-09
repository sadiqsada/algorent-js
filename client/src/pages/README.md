This folder contains all the webpages for AlgoRent. Our React application uses this folder to route to the referenced webpage.

To redirect user from one page to another, use the following imports:

1) Check if the page you're routing to exists in App.js, if not:
    1.1) Go to App.js and import the page.js that you're redirecting to
    1.2) Next inside App.js, create a new route, just copy the existing routes to create the new one
3) Inside the page you're redirecting, just add the Link tag:
`<Link href='/the route'>`