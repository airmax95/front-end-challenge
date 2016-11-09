(function($) {

  'use strict';

  //********************************
  //  PAGE CLASS
  //********************************  

  function Page(){}

  Page.prototype.getProducts = function(url) {
    return $.getJSON(url);
  };

  Page.prototype.getTemplate = function(template){
    return $.get(template);
  };

  Page.prototype.setUpProductView = function(aProducts, template) {
    var oProduct = {};
    var viewHtml = '';
    aProducts.map(function(oItem, idx) {
      oProduct = new Product(oItem, idx);
      oProduct.updateHtml(template);
      viewHtml += oProduct.productTemplate;
    });
    return appendProducts(viewHtml);
  };

  //********************************
  //  PRODUCT CLASS
  //******************************** 

  function Product(oProduct, index) {
    this.id               = oProduct.id;
    this.title            = oProduct.name;
    this.description      = oProduct.description;
    this.tagline          = oProduct.tagline;
    this.photo            = oProduct.photos.medium_half;
    this.url              = oProduct.url;
    this.index            = index;
    this.custom_class     = "col"+ ((index % 4) +1);
    this.productTemplate  = '';
  }
    
  Product.prototype.updateHtml= function(template){
    return this.productTemplate = template.replace('{image}', this.photo)
                                          .replace('{title}', this.title)
                                          .replace('{tagline}', this.tagline)
                                          .replace('{url}', this.url)
                                          .replace('{description}', this.description)
                                          .replace('{custom_class}', this.custom_class);
  };

  //********************************
  //  UTILITY
  //******************************** 

  function appendProducts(viewHtml) {
    $('#content').append(viewHtml);
    return removeSpinner();
  }

  function removeSpinner() {
    return $('.loading-spinner').remove(); 
  }

  function listenForRemoveItem() {
    return $('#content').on('click', '.remove-item', removeProduct);
  }

  function removeProduct(e) {
    e.preventDefault();
    var target = $(this.closest('.product-container'));
    return target.hide('fast');
  }

  //********************************
  //  INIT
  //******************************** 

  (function init() {
    var page = new Page();
    listenForRemoveItem();
    return $.when(page.getProducts('data.json'), page.getTemplate('product-template.html'))
      .done(function(oProducts, template) {
        return page.setUpProductView(oProducts[0].sales, template[0]);
      });
  })();
  
})(window.jQuery);

/********************************

UPDATED REFACTOR 11/8/16:

Set up the product view after all promises have been resolved. Also optimized by consolidating the page methods that were iterating over the same products array and moved some methods into the utility section.

COMMENTARY:

First off, I wanted to focus on making my code readable above all else. I feel that using Hungarian notation to let others on the project know which type to expect, setting up prototypal inheritance, and restricting each function's responsibility makes for more readable code, as well as making it more modular and testable because of a more explicit stack trace with smaller functions. I also feel that using .map instead of for loops helps with readability and leads to less off by 1 errors. As far as cross-browser compatibility goes, I added vendor prefixes to cover the last 4 versions of every browser. And since we're in the age of social media, I decided to update "var self" to "var selfie" in order to reflect the times.

To make loading images better, I reduced the product-template.html down to a single call. In a production app, I'd probably implement lazy loading so that only the images the user wants to see are loaded which will lead to faster load times and cut down on server load. I'd also make sure that gzip compression is enabled, leverage browser caching and cache items for a certain period of time, perform lossless image compression, and make sure all of the files are minified. One thing I changed on mobile is not showing the description on a hover state since users can't hover on mobile. I feel that showing the description as the user is scrolling can be confusing and is bad UX in my opinion.

As far as libraries are concerned, I'd investigate rollup.js for tree-shaking to get rid of the unused jQuery and Bootstrap, es6 for things like passing in the 'this' context much easier, and React for rendering the views. If the app were more complex, then I'd consider using Redux for state management, lodash as a utility library, and webpack for bundling to start.

********************************/