
import LVDate from '../models/LVDate.jsx';

import LoginPage from '../pages/LoginPage/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage/RegisterPage.jsx';

import CalendarPage from '../pages/CalendarPage/CalendarPage.jsx';
    import SearchPage from '../pages/CalendarPage/sub-pages/SearchPage.jsx';
    import BedsPage from '../pages/CalendarPage/sub-pages/BedsPage.jsx';
    import Beds4Page from '../pages/CalendarPage/sub-pages/Beds4Page.jsx';
    import SaunaPage from '../pages/CalendarPage/sub-pages/SaunaPage.jsx';

const routes = {
    auth: {
        redirectUrl: "/login",
        pages: {
            login: {
                title: "Pieslēgšanās",
                url: "/login",
                component: LoginPage
            },
            register: {
                title: "Reģistrēšanās",
                url: "/register",
                component: RegisterPage
            },
        }
    },
    system: {
        redirectUrl: "/calendar/search",
        pages: {
            calendar: {
                title: "Kalendārs",
                url: "/calendar",
                component: CalendarPage,
                subPages: {
                    search: {
                        title: "Datu meklēšana",
                        url: "/search",
                        getDefaultURLValues () {
                            return '';
                        },
                        component: SearchPage
                    },
                    beds: {
                        title: "Gultas",
                        url: '/beds',
                        getDefaultURLValues () {
                            const date = new LVDate();
                            return `?year=${date.getFullYear()}&month=${date.getMonth()}`;
                        },
                        component: BedsPage
                    },
                    sauna: {
                        title: "Pirts",
                        url: "/sauna",
                        getDefaultURLValues () {
                            const date = new LVDate();
                            return `?year=${date.getFullYear()}&month=${date.getMonth()}`;
                        },
                        component: SaunaPage
                    }
                }
            }
        }
    }
};

export default routes;