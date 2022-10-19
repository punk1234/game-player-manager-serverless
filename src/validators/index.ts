import Container from "typedi";
import { default as UserValidatorImpl } from "./user.validator";
import { default as GameValidatorImpl } from "./game.validator";

export const UserValidator = Container.get(UserValidatorImpl);
export const GameValidator = Container.get(GameValidatorImpl);