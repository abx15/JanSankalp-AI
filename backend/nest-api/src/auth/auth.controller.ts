import { Controller, Post, Body, Res, Req, UnauthorizedException, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(body);
    this.setCookies(res, result.refreshToken);
    return {
      success: true,
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('login')
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(body);
    this.setCookies(res, result.refreshToken);
    return {
      success: true,
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // Read refresh token from cookies
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const result = await this.authService.refreshToken(refreshToken);
    this.setCookies(res, result.refreshToken);
    return {
      success: true,
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('session')
  async getSession(@Req() req: any) {
    return {
      success: true,
      user: req.user,
    };
  }

  private setCookies(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
