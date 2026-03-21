import { Form, Input, Button, message } from "antd";
import s from './RegisterPage.module.scss';
import { Link, useNavigate } from "react-router";
import { LeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";

export function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: {
        name: string;
        surname: string;
        patronymic?: string;
        email: string;
        login: string;
        password: string;
    }) => {
        setLoading(true);
        try {
            await axios.post('/api/users', values);
            message.success('Регистрация прошла успешно!');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            message.error('Ошибка при регистрации. Попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.formWrapper}>
            <Form
                className={s.form}
                name="register"
                autoComplete="off"
                onFinish={onFinish}
            >
                <Link to="/" className={s.backButton} type="link"><LeftOutlined /></Link>
                <Form.Item
                    label="Имя"
                    name="name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Фамилия"
                    name="surname"
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
                >
                    <Input type="email" />
                </Form.Item>
                <Form.Item
                    label="Логин"
                    name="login"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Пароль:"
                >
                    <Input type="password" />
                </Form.Item>
                <Button htmlType="submit" type="primary" loading={loading}>
                    Зарегистрироваться
                </Button>
                <p>
                    Уже зарегистрированы? <Link to="/login">Войти</Link>
                </p>
            </Form>
        </div>
    );
}