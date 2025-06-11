import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from "src/users/users.service";
import { AuthRepository } from "../auth.repository";
import { User } from "src/users/user.entity";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        // private usersService: UsersService,
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository,
        configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    // async validate(payload: { sub: number }) {
    //     const user = await this.authRepository.findyId(payload.sub);
    //     if (!user) throw new UnauthorizedException('User not found');
    //     return user;
    // // The user object will be available in the request object as req.user
    // }

    async validate(payload: { email: string, sub: number }) {
        const { email } = payload;
        const user = await this.authRepository.findOneBy({ email });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}