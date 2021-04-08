import React from "react";
import "./style.css";

import { Form, Input, Button, message, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { useUserContext } from "../../context/user/user.context";

const Login = () => {

  const { login, errorMsg } = useUserContext();

  const onFinish = (values: any) => {
    login(values);
  };

  return (
    <div className="Login-Container">

      <div className="Login-Header">
        <h1>MktWar</h1>
      </div>

      <div className="Login-Form">
        <Form
          name="basic"
          onFinish={onFinish}
        >
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
            <Button size="large" type="primary" htmlType="submit" className="Login-form-button">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="Login-Footer">
        <p>
          {" "}
          Não tem uma conta ? <a>Criar Conta</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
