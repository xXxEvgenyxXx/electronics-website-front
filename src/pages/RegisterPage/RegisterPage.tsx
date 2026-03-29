import { Form, Input, Button, message } from "antd";
import s from './RegisterPage.module.scss';
import { Link, useNavigate } from "react-router";
import { LeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";

interface User {
    id?: number;
    name: string;
    surname: string;
    patronymic?: string;
    email: string;
    login: string;
    password?: string;
}

export function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // Функция проверки уникальности
    const checkUniqueness = async (email: string, login: string): Promise<{ isUnique: boolean; errors: { email?: string; login?: string } }> => {
        const errors: { email?: string; login?: string } = {};
        try {
            // Получаем всех пользователей (можно добавить фильтрацию на сервере, если есть)
            const response = await axios.get<User[]>('/api/users');
            const users = response.data;

            const emailExists = users.some(user => user.email === email);
            const loginExists = users.some(user => user.login === login);

            if (emailExists) {
                errors.email = 'Этот email уже используется';
            }
            if (loginExists) {
                errors.login = 'Этот логин уже используется';
            }

            return { isUnique: !emailExists && !loginExists, errors };
        } catch (error) {
            console.error('Ошибка при проверке уникальности:', error);
            message.error('Не удалось проверить данные. Попробуйте позже.');
            // В случае ошибки сети разрешаем отправку (или можно запретить – на ваше усмотрение)
            return { isUnique: true, errors: {} };
        }
    };

    const onFinish = async (values: {
        name: string;
        surname: string;
        patronymic?: string;
        email: string;
        login: string;
        password: string;
    }) => {
        setChecking(true);
        // Проверяем уникальность
        const { isUnique, errors } = await checkUniqueness(values.email, values.login);
        setChecking(false);

        if (!isUnique) {
            const fieldErrors = [];
            if (errors.email) fieldErrors.push({ name: 'email', errors: [errors.email] });
            if (errors.login) fieldErrors.push({ name: 'login', errors: [errors.login] });
            form.setFields(fieldErrors);
            return;
        }

        const registrationData = {
            ...values,
            roleID: 1 
        };

        // Если всё уникально, отправляем запрос на регистрацию
        setLoading(true);
        try {
            await axios.post('/api/users', registrationData); // Используем модифицированные данные
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
                form={form}
                name="register"
                autoComplete="off"
                onFinish={onFinish}
            >
                <Button
                    className={s.backButton}
                    type="link"
                    icon={<LeftOutlined />}
                    onClick={() => navigate(-1)}
                />
                <Form.Item
                    label="Имя"
                    name="name"
                    rules={[{ required: true, message: 'Введите имя' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Фамилия"
                    name="surname"
                    rules={[{ required: true, message: 'Введите фамилию' }]}
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
                    rules={[
                        { required: true, message: 'Введите email' },
                        { type: 'email', message: 'Введите корректный email' }
                    ]}
                >
                    <Input type="email" />
                </Form.Item>
                <Form.Item
                    label="Логин"
                    name="login"
                    rules={[{ required: true, message: 'Введите логин' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Пароль:"
                    rules={[{ required: true, message: 'Введите пароль' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Button htmlType="submit" type="primary" loading={loading || checking}>
                    Зарегистрироваться
                </Button>
                <p>
                    Уже зарегистрированы? <Link to="/login">Войти</Link>
                </p>
            </Form>
        </div>
    );
}