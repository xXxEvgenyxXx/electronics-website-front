import { 
    MainPage,
    AboutPage,
    CartPage,
    CatalogPage,
    ContactsPage,
    FavoritePage,
    LoginPage,
    RegisterPage,
    ProfilePage
} from "@/pages";

export const routes = [
    {
        name: "Главная",
        path: "/",
        element: MainPage
    },
    {
        name: "О нас",
        path: "/about",
        element: AboutPage
    },
    {
        name: "Корзина",
        path: "/cart",
        element: CartPage
    },
    {
        name: "Каталог",
        path: "/catalog",
        element: CatalogPage
    },
    {
        name: "Контакты",
        path: "/contacts",
        element: ContactsPage
    },
    {
        name: "Избранное",
        path: "/favorite",
        element: FavoritePage
    },
    {
        name:"Войти",
        path:"/login",
        element: LoginPage
    },
    {
        name: "Регистрация",
        path:"/register",
        element: RegisterPage
    },
]
export const protectedRoutes = [
    {
        name:"Личный кабинет",
        path:'/profile',
        element: ProfilePage
    }
]