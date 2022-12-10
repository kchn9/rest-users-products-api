import Controller from "@/interfaces/controller.interface";
import validationMiddleware from "@/middleware/validation.middleware";
import UserService from "@/services/user.service";
import HttpError from "@/utils/errors/HttpError";
import userValidator, { CreateUserInput } from "@/validators/user.validator";
import { NextFunction, Request, Response, Router } from "express";

class UserController implements Controller {
    public path = "/users";
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        /**
         * @route GET /api/users
         */
        this.router.get(this.path, this.findAll);

        /**
         * @route POST /api/users
         */
        this.router.post(
            this.path,
            validationMiddleware(userValidator.create),
            this.create
        );
    }

    private findAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const users = await this.UserService.findAll();
            res.status(200).json(users);
        } catch (e) {
            next(new Error("Unable to get all user records"));
        }
    };

    private create = async (
        req: Request<unknown, unknown, CreateUserInput["body"]>,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const user = await this.UserService.create(req.body);
            res.status(201).json(user);
        } catch (e) {
            next(
                new HttpError(
                    409,
                    "Unable to create new user, potential conflict"
                )
            );
        }
    };
}

export default UserController;
