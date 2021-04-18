import UserModel = require("../models/user.model");

//JWT
import jwt = require("jsonwebtoken");
//BcryptJs
import bcrypt = require("bcryptjs");

// --> Gerar token
const genToken = (key: number): string => {
  const token: string = jwt.sign({ key }, process.env.JWT_SECRET, {
    expiresIn: 31536000,
  });

  return token;
};


interface IErrorResponse{
 errorCode: number;
 data: string;
}

export const LoginUser = async (username: string, password: string): Promise<string | IErrorResponse> => {

  if (!username || !password)
    return {
      errorCode: 4,
      data: "Usuário ou senha inválidos !",
    };

  let existingUser = await  UserModel.login(username, password);

  if (!existingUser) {
    return {
      errorCode: 4,
      data: "Usuário ou senha inválidos !",
    };
  }

  const validPassword: string = await bcrypt.compare(
    password,
    existingUser.player_password
  );

  if (!validPassword) {
    return {
      errorCode: 4,
      data: "Usuário ou senha inválidos !",
    };
  }

  let token: string = genToken(parseInt(existingUser.player_id));

  return token;
};

export const CreateUser = async (username: string, name: string, password: string): Promise<string | IErrorResponse> => {

  if(!username || !name || !password)
    return {
      errorCode: 4,
      data: "Preencha todas os campos obrigatórios, Por Favor !",
    };

  let hash = bcrypt.hashSync(
    password,
    parseInt(process.env.SALT_ROUNDS)
  );

  let newUser = await UserModel.createUser(username, name, hash); 

  if(newUser === "ER_DUP_ENTRY")
    return {
      errorCode: 4,
      data:  `Ops ! o usuario :  ${username} já está em uso, deseja fazer login ?`,
    };

    let token: string;
    if(typeof newUser === "number")
      token = genToken(parseInt(newUser));

   return token;
}


export const UserProfile = async (id: number): Promise<UserModel | IErrorResponse> => {

    if (!id) 
      return {
        errorCode: 4,
        data: "Usuário não encontrado !",
      };
    
    let userInfo = await UserModel.profile(id);

    if(!userInfo)
      return {
        errorCode: 4,
        data: "1Usuário não encontrado !",
      };

    return userInfo;
    
}

export const GetUserSocketIdById = async (userId: number): Promise<string | IErrorResponse> => {

  if(!userId)
      return {
        errorCode: 4,
        data: "Usuário não encontrado !",
      };

  let socketId: string = await UserModel.GetUserSocketIdById(userId);

  if(!socketId)
      return {
        errorCode: 4,
        data: "Usuário não está online !",
      };
      
  return socketId;

}


export const UserConnected = async (userId: string, socketId: string):Promise<void> => {

  await UserModel.UserConnected(parseInt(userId), socketId);

}

export const OnlinePlayers = async (): Promise<any[]> => {
  let users: any[];

  users = await UserModel.OnlinePlayers();

  return users;
}


export const Logout = async (userId: number): Promise<string | IErrorResponse> => {

  let result: string;

  if(!userId)
      return {
        errorCode: 4,
        data: "Usuário não encontrado !",
      };

   result = await UserModel.Logout(userId);

   if(!result)
      return {
        errorCode: 4,
        data: "Usuário não está online !",
      };

    return 'Usuario logout';

}
