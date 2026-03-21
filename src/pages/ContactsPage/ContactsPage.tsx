import { MainLayout } from "@/widgets"
import s from './ContactsPage.module.scss'
import { Form, Input, Button } from "antd"
import clsx from "clsx"
import { SendOutlined, PhoneOutlined } from "@ant-design/icons"

export function ContactsPage(){
    return (
        <MainLayout>
            <div className={s.contactsPageWrapper}>
                <div className={s.contactsElement}>
                    <PhoneOutlined className={s.icon} />
                    <h2 className={s.title}>Звоните нам</h2>
                    <p>Мы доступны 24/7. Ждем вашего звонка!</p>
                    <p>Телефон: +7 905 563 27-33</p>
                </div>
                <Form
                    name="message"
                    className={clsx(s.messageForm, s.contactsElement)}
                >
                    <Form.Item className={s.messageDataInput}>
                        <Input placeholder="Ваше имя" name="name" required />
                    </Form.Item>
                    <Form.Item className={s.messageDataInput}>
                        <Input placeholder="Ваша электронная почта" type="email" name="email" required />
                    </Form.Item>
                    <Form.Item className={s.messageDataInput}>
                        <Input placeholder="Ваш телефон" type="tel" name="phone" required />
                    </Form.Item>
                    <Form.Item className={s.messageInput}>
                        <Input.TextArea placeholder="Сообщение нам" name="message" required />
                    </Form.Item>
                    <Button className={s.button} htmlType="submit">Отправить сообщение <SendOutlined /></Button>
                </Form>
            </div>
        </MainLayout>
    )
}