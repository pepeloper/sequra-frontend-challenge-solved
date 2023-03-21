# Frontend coding challenge
This is the prototype for the frontend coding challenge based on the provided code base.
Considering that it is a work that I could have in my day to day at Sequra, I decided to take it as such, also taking into account the time I had to do the challenge. Having read the specifications I consider that the challenge is to embed this prototype in the different merchants in a transparent, extensible way, minimizing the entry barrier in the implementation and taking into account the simplicity and testing of the widget. So, I have approached it in the following way:

The project is a Vue.js 3 library that compiles to web components based on custom elements standard, which has a [very extended [support in all modern browsers](https://caniuse.com/custom-elementsv1)

This allows us to have a reusable prototype for all merchants, modularity to extend, reduce or add functionalities as we need, and encapsulation and isolation which allows us to test only the widget's core.

This allows the `SequraWidget` component to be compatible with almost [any framework](https://custom-elements-everywhere.com/), including plain html with vanilla javascript as we can see in the merchant site demo.

It also includes unit tests covering the basic widget functionality.

## Set up and run

Make sure you already have the Sequra mocked API environment located under the `api` folder up and running.

> Note that being a protype I uploaded the full .env file to make easier the installation steps, but this should be added to a .gitignore in a live scenario.

Run the following commands here, in the `sequra-widget` folder
* `npm install`
* `npm run dev`
* Should have a prompt wih the local url.

You can run the tests by using `npm run test` or `npm run coverage` to output a coverage report.

Use `npm run build` to build the project. Output files will be located in the dist folder.

## How to use

Load the sequra-widget script. This should be uploaded to a package manager like npm, and we could use a cdn to load the widget. In this case being a local prototype we can reference the relative path on our system and place it and the end of the `body` tag in our html main file.

`<script src="./dist/sequra-widget.js"></script>`

Now we are ready to use the sequra-widget component:

`<sequra-widget id="sequra-widget" total-with-tax="39999"></sequra-widget>`

>  It's recommended to use an `id`attribute to make it easier to interact with it in javascript.

Note that the attribute `total-with-tax` should be the total value of the items in EUR cents.

If the total changes we can update the widget by using the following code snippet:
```
const sequraWidget = document.querySelector('#sequra-widget')
sequraWidget.setAttribute('total-with-tax', 50000)
```

Also refer to `merchant-site/product-page.html` and `merchant-site/main.js` for code examples and a interactive demo.

If you are using this with a javascript library or framework such a React, Angular or Vue.js you should follow specific implementations and guidelines.

## How to distribute the prototype to all merchants
I'll upload the library to a package manager like npm, so the library can be used as a dependency in any project and it's also available on a CDN like unpkg.

Also build a documentation site with detailed code examples and implementations on any major javascript library/framework and plain html + css + javascript.

And I'll also evaluate to integrate the library with a bug and log reporting system to be able to fix any reported issue since being such a wide audience I am sure there will be very specific bugs.
