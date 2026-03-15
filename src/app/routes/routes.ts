import { 
    MainPage,
    AboutPage,
    CartPage,
    CatalogPage,
    ContactsPage,
    FavoritePage,
    LoginPage,
    RegisterPage
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
    }
]