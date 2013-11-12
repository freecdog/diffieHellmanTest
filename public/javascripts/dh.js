/**
 * Created by jaric on 16.09.13.
 */

(function($) {

    $.dh = {};

    //  Models

    $.dh.DiffieHellmanModel = Backbone.Model.extend({
        urlRoot: '/diffie',
        defaults: {
            key: null
        }
    });

    //  View

    $.dh.DiffieHellmanView = Backbone.View.extend({
        tagName: 'div',
        id: 'infoHolder',

        initialize: function(){
            this.render();
        },

        render: function() {
            this.$el.append(this.testDiffieHellman());

            return this;
        },

        testDiffieHellman: function(){
            return "testDiffieHellman<br>" + this.model.key;
        }
    });

    //  Router

    $.dh.Router = Backbone.Router.extend({
        routes: {
            "": "visualize"
        },

        visualize: function() {
            var check = DiffieHellmanGroup("modp5");

            var dh = new $.dh.DiffieHellmanModel();
            dh.set({key: sessionStorage.getItem("key")});
            console.log("key", dh.attributes.key);
            dh.sync("update", dh, {
                success: function(obj){
                    console.log("diffieModel", obj);
                    sessionStorage.setItem("key", obj.key);
                    $.dh.diffieHellman = new $.dh.DiffieHellmanView({el: $('#infoHolder'), model: obj});
                }
            });
        }
    });

    //  App

    $.dh.app = null;

    $.dh.bootstrap = function() {
        $.dh.app = new $.dh.Router();
        Backbone.history.start({pushState: true});
    };

})(jQuery);