import React from "react";
import "./style.css";

import { Form, Input, Button, message, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { useUserContext } from "../../context/user/user.context";

import history from '../../utils/history';

const Register = () => {

  const { createUser, errorMsg } = useUserContext();

  const onFinish = (values: any) => {
    createUser(values);
  };

  const goLogin= () => {
    history.push('/login');
  }

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
            <div className="mktwar-default-button-container" >
                <button className="mktwar-default-button">Criar conta</button>
            </div>
          </Form.Item>
        </Form>
      </div>

      <div className="Register-Footer">
        <button onClick={goLogin} className="register-login-option">Já tem uma conta ? Fazer Login</button>
      </div>
    </div>
  );
};

export default Register;
