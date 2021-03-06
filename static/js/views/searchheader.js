define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/searchheader.html',
], function($, _, BackBone, searchHeaderTemplate) {

  // the header does not re-render on collection events
  // it just handles applying the query to the collection of models
  var SearchHeaderView = BackBone.View.extend({
    id: 'search-header',
    className: 'search-header',

    events: {
      'keyup #search-box'    : 'onSearch',
    },

    initialize: function() {
      _.bindAll(this, 'render','onSearch');
      this.template = _.template(searchHeaderTemplate);
      this.render();
    },

    render: function() {
      console.log('rendering search header');
      var initialQuery = this.options.query ? this.options.query : "";
      $(this.el).html(this.template({ query: initialQuery }));
      return this;
    },

    onSearch: function() {
      console.log('onSearch');
      var query = $.trim(this.$('#search-box').val()).toLowerCase();

      // todo: replacestate...
      BackBone.history.navigate(query, false);

      var queryExists = !(query === '');
      if (!queryExists) {
        query = '.';
      }
      console.log('searching for ' + query);

      query = new RegExp(query, 'i'); // Ignore case
      var searchfn = function(model) {
        // BEGIN GLORIOUS SEARCH ALGORITHM
        return query.test(model.get('htmlEscapedTitle'));
        // END GLORIOUS SEARCH ALGORITHM
      };
      this.collection.each(function(model) {
        var visible = searchfn(model);
        model.set({tocVisible: visible, mainVisible: visible && queryExists});
      });
    },

  });

  return SearchHeaderView;
});
