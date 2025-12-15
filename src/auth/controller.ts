import { Request, Response } from "express";
import { AuthModel } from "./model";
import { validateRegister, validateLogin } from "./validator";

export const AuthController = {

  async register(req: Request, res: Response) {
    console.log("loginAPI ....................working Fine")
    const error = validateRegister(req.body);
    if (error) return res.status(400).json({ error });

    const { username, email, password } = req.body;

    // const existing = await AuthModel.findByEmail(email);
    // if (existing) {
    //   return res.status(400).json({ error: "Email already exists" });
    // }

    const user = await AuthModel.createUser({ username, email, password });

    return res.json({
      message: "User Registered Successfully",
      user
    });
  },

  async login(req: Request, res: Response) {
    const error = validateLogin(req.body);
    if (error) return res.status(400).json({ error });

    const { email, username, password } = req.body;

    const user = await AuthModel.findByCredentials(username, password);
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // simple password match
    // if (user.password !== password) {
    //   return res.status(400).json({ error: "Invalid email or password" });
    // }

    // We return user as logged in
    return res.json({
      message: "Login successful",
      sucess:true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  },

  logout(req: Request, res: Response) {
    return res.json({ message: "Logout success" });
  }

};
