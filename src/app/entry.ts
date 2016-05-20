import * as Vue from 'vue';

import Component from 'vue-class-component';
import * as VueResource from 'vue-resource';
import * as VueRouter from 'vue-router';

import Config from './config';
import Auth from './stores/auth';

import transState from './states/transactions/state';
import loginState from './states/login/state';
import dashState from './states/dashboard/state';

Vue.use(VueResource);
Vue.use(VueRouter);

Vue.http.options.root = 'https://api.pocketsmith.com/v2';

@Component({
	template: require('./views/entry.pug'),
	replace: false
})
class App extends Vue {
	data(): any {
		return {
			loaded: false
		}
	}

	created(): void {
		if (!Auth.isLogged) {
			this.$route.router.go({name: 'login'});
		}
	}
}

var router = new VueRouter();

router.map({
	'/login': {
		name: 'login',
		component: loginState,
		auth: false
	},
	'/dashboard': {
		name: 'dashboard',
		component: dashState,
		auth: true
	},
	'/transactions': {
		name: 'transactions',
		component: transState,
		auth: true
	}

});

router.beforeEach((trans:any) => {
	if (trans.to.auth && !Auth.isLogged) {
		trans.redirect('/login');
	} else {
		trans.next();
	}
});

router.start(App, '#app');
