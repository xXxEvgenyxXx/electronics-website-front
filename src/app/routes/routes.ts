import { 
    MainPage,
    CartPage,
    CatalogPage,
    ContactsPage,
    FavoritePage,
    LoginPage,
    RegisterPage,
    ProfilePage,
    ProfileOrdersPage,
    AdminPanelPage,
    DeliveryPage
} from "@/pages";

export const routes = [
    {
        name: "Главная",
        path: "/",
        element: MainPage
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
    },
    {
        name: "Корзина",
        path: "/cart",
        element: CartPage
    },
    {
        name: "Доставка",
        path: "/delivery",
        element: DeliveryPage
    },
    {
        name: "Избранное",
        path: "/favorite",
        element: FavoritePage
    },
    {
        name:"Мои заказы",
        path: "/my-orders",
        element: ProfileOrdersPage
    }
]
export const adminRoutes = [
    {
        name: "Панель администратора",
        path: "/admin-panel",
        element: AdminPanelPage
    }
]