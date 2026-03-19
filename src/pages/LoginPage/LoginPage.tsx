import { Form, Input, Button } from "antd"
//import type { FormProps } from "antd"
import s from './LoginPage.module.scss'
import { Link } from "react-router"
import { LeftOutlined } from "@ant-design/icons"

//interface LoginFormType {
//    login: string,
//    email:string,
//    password: string,
//    name: string,
//    surname:string,
//    patronymic?:string
//}

export function LoginPage(){
    return (
        <div className={s.formWrapper}>
            <Form
                className={s.form}
                name="login"
                autoComplete="on"
            >
                <Link to="/" className={s.backButton} type="link"><LeftOutlined/></Link>
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
                    Не зарегистрированы? <Link to="/register">Зарегистрироваться</Link>
                </p>
            </Form>
        </div>
    )
}