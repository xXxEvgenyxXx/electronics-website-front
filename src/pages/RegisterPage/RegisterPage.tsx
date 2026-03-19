import { Form, Input, Button } from "antd"
//import type { FormProps } from "antd"
import s from './RegisterPage.module.scss'
import { Link } from "react-router"

//interface LoginFormType {
//    login: string,
//    email:string,
//    password: string,
//    name: string,
//    surname:string,
//    patronymic?:string
//}

export function RegisterPage(){
    return (
        <div className={s.formWrapper}>
            <Form
                className={s.form}
                name="register"
                autoComplete="off"
            >
                <Link to="/" className={s.backButton} type="link">&lt;</Link>
                <Form.Item
                    label="Имя"
                    name="name"
                    rules={[{ required: true, message: 'Это поле обязательно'}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Фамилия"
                    name="surname"
                    rules={[{ required: true, message: 'Это поле обязательно'}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Отчество (при наличии)"
                    name="patronymic"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Электронная почта"
                    name="email"
                    rules={[{ required: true, message: 'Это поле обязательно'}]}
                >
                    <Input type="email" />
                </Form.Item>
                <Form.Item
                    label="Логин"
                    name="login"
                    rules={[{ required: true, message: 'Это поле обязательно'}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[{ required: true, message: 'Это поле обязательно'}]}
                >
                    <Input type="password" />
                </Form.Item>
                <Button htmlType="submit">
                    Войти
                </Button>
                <p>
                    Уже зарегистрированы? <Link to="/login">Войти</Link>
                </p>
            </Form>
        </div>
    )
}