import React from "react";
import "./style.css";

import { Form, Input, Button, message, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { useUserContext } from "../../context/user/user.context";

const Register = () => {

  const { createUser, errorMsg } = useUserContext();

  const onFinish = (values: any) => {
    createUser(values);
  };

  return (
    <div className="Register-Container">

      <div className="Register-Header">
        <h1>MktWar</h1>
      </div>

      <div className="Register-Form">
        <Form
          name="basic"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Insira seu nome por favor !" }]}
          >
            <Input placeholder="nome" prefix={<UserOutlined />} size="large"/>
          </Form.Item>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Insira seu usuário por favor !" }]}
          >
            <Input placeholder="Usuário" prefix={<UserOutlined />} size="large"/>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Insira sua senha por favor !" }]}
          >
            <Input.Password size="large" placeholder="Senha" prefix={<LockOutlined />}/>
          </Form.Item>

          <Form.Item >
            <Button size="large" type="primary" htmlType="submit" className="Register-form-button">
              Criar Conta
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="Register-Footer">
        <p>
          {" "}
          Já tem uma conta ? <a>Fazer Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
