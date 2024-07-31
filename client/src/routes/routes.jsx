import LoginPage from '../pages/LoginPage/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage/RegisterPage.jsx';

import CalendarPage from '../pages/CalendarPage/CalendarPage.jsx';
import SearchPage from '../pages/CalendarPage/subPages/SearchPage.jsx';
import BedsPage from '../pages/CalendarPage/subPages/BedsPage.jsx';
import Beds4Page from '../pages/CalendarPage/subPages/Beds4Page.jsx';
import SaunaPage from '../pages/CalendarPage/subPages/SaunaPage.jsx';

const routes = {
    login: {
        title: "Pieslēgšanās",
        url: "/login",
        component: <LoginPage />
    },
    register: {
        title: "Reģistrēšanās",
        url: "/register",
        component: <RegisterPage />
    },
    system: {
        pages: {
            calendar: {
                title: "Kalendārs",
                url: "calendar",
                component: <CalendarPage />,
                subPages: {
                    search: {
                        title: "Datu meklēšana",
                        urlName: "/search",
                        component: <SearchPage />
                    },
                    beds: {
                        title: "Gultas",
                        urlName: "/beds",
                        component: <BedsPage />
                    },
                    beds4: {
                        title: "Gultas 4. stāvs",
                        urlName: "/beds4",
                        component: <Beds4Page />
                    },
                    sauna: {
                        title: "Pirts",
                        urlName: "/sauna",
                        component: <SaunaPage />
                    }
                }
            }
        }
    }
};

export default routes;