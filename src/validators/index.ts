import Container from 'typedi';
import {default as UserValidatorImpl} from './user.validator';
import {default as GameValidatorImpl} from './game.validator';
import {default as GameplayScoreValidatorImpl} from './game-play-score.validator';

export const UserValidator = Container.get(UserValidatorImpl);
export const GameValidator = Container.get(GameValidatorImpl);
export const GameplayScoreValidator = Container.get(GameplayScoreValidatorImpl);
