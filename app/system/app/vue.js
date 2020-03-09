import Vue from 'vue';

import VueIntl from 'vue-intl';
import VueResource from 'vue-resource';
import Cache from './lib/cache';
import Asset from './lib/asset';
import State from './lib/state';
import ResourceCache from './lib/resourceCache';
import Csrf from './lib/csrf';
import Notify from './lib/notify';
import Trans from './lib/trans';
import Filters from './lib/filters';

import VLoader from './components/loader.vue';
import VModal from './components/modal.vue';
import VPagination from './components/pagination';
import InputFilter from './components/input-filter.vue';
import InputDate from './components/input-date.vue';
import InputImage from './components/input-image.vue';
import InputImageMeta from './components/input-image-meta.vue';
import InputVideo from './components/input-video.vue';
import Validation from './components/validation.vue';

//import CheckAll from './directives/check-all';
import Confirm from './directives/confirm';
import Gravatar from './directives/gravatar';
import Order from './directives/order';
import LazyBackground from './directives/lazy-background';
import StackMargin from './directives/stack-margin';

const install = (Vue) => {
    const config = window.$biskuit;

    Vue.cache = Vue.prototype.$cache = Cache(config.url);
    Vue.session = Vue.prototype.$session = Cache('session', {
        load(name) {
            if (Vue.cache.get('_session') !== Vue.cache.get('_csrf')) {
                Vue.cache.remove(name);
            }
            Vue.cache.set('_session', Vue.cache.get('_csrf'));
            return Vue.cache.get(name, {});
        },
        store(name, data) {
            return Vue.cache.set(name, data);
        }
    });

    /**
     * Libraries
     */

    Vue.use(VueIntl);
    Vue.use(VueResource);
    Vue.use(Asset);
    Vue.use(State);
    Vue.use(ResourceCache);
    Vue.use(Csrf);
    Vue.use(Notify);
    Vue.use(Trans);
    Vue.use(Filters);

    /**
     * Components
     */

    Vue.component('v-loader', VLoader);
    Vue.component('v-modal', VModal);
    Vue.component('v-pagination', VPagination);
    Vue.component('input-filter', InputFilter);

    Vue.use(InputDate);
    Vue.use(InputImage);
    Vue.use(InputImageMeta);
    Vue.use(InputVideo);
    Vue.use(Validation);

    /**
     * Directives
     */

    //Vue.directive('check-all', CheckAll);
    Vue.directive('confirm', Confirm);
    Vue.directive('gravatar', Gravatar);
    Vue.directive('order', Order);
    Vue.directive('lazy-background', LazyBackground);
    Vue.directive('stack-margin', StackMargin);

    /**
     * Resource
     */

    Vue.url.options.root = config.url.replace(/\/index.php$/i, '');
    Vue.http.options.root = config.url;
    Vue.http.options.emulateHTTP = true;

    Vue.url.route = function(url, params) {
        let options = url;

        if (!_.isPlainObject(options)) {
            options = { url, params };
        }

        Vue.util.extend(options, {
            root: Vue.http.options.root
        });

        return this(options);
    };

    Vue.url.current = Vue.url.parse(window.location.href);

    Vue.ready = function(fn) {
        if (_.isObject(fn)) {
            let options = fn;
            fn = () => new Vue(options);
        }

        let handle = function() {
            document.removeEventListener('DOMContentLoaded', handle);
            window.removeEventListener('load', handle);
            fn();
        };

        if (document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll) {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', handle);
            window.addEventListener('load', handle);
        }
    };
}

if (window.Vue) {
    Vue.use(install);
}

window.history.pushState = window.history.pushState || function() {};
window.history.replaceState = window.history.replaceState || function() {};
