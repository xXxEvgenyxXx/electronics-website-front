import { Form, Input, Button, message } from "antd";
import s from './LoginPage.module.scss';
import { Link, useNavigate } from "react-router";
import { LeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";

export function LoginPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: { login: string; password: string }) => {
        setLoading(true);
        try {
            // Получаем всех пользователей
            const response = await axios.get('/api/users');
            const users = response.data;

            // Ищем пользователя с указанным логином и паролем
            const user = users.find(
                (u: any) => u.login === values.login && u.password === values.password
            );

            if (user) {
                message.success('Вход выполнен успешно!');
                // Сохраняем данные пользователя (исключая пароль для безопасности)
                const { password, ...userWithoutPassword } = user;
                localStorage.setItem('user', JSON.stringify(userWithoutPassword));
                localStorage.setItem('userId', user.id);
                navigate('/');
            } else {
                message.error('Неверный логин или пароль');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('Ошибка при входе. Попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.formWrapper}>
            <Form
                className={s.form}
                name="login"
                autoComplete="on"
                onFinish={onFinish}
            >
                <Button
                    className={s.backButton}
                    type="link"
                    icon={<LeftOutlined />}
                    onClick={() =>  navigate(-1)}
                />
                <Form.Item
                    label="Логин"
                    name="login"
                    rules={[{ required: true, message: 'Это поле обязательно' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[{ required: true, message: 'Это поле обязательно' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Button htmlType="submit" type="primary" loading={loading}>
                    Войти
                </Button>
                <p>
                    Не зарегистрированы? <Link to="/register">Зарегистрироваться</Link>
                </p>
            </Form>
        </div>
    );
}