import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthenticationException extends HttpException {
  constructor(message = 'Authentication failed') {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message,
        error: 'AuthenticationError',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidCredentialsException extends AuthenticationException {
  constructor(message = 'Invalid credentials provided') {
    super(message);
  }
}

export class AccountInactiveException extends AuthenticationException {
  constructor(message = 'Account is inactive or suspended') {
    super(message);
  }
}

export class TwoFactorRequiredException extends HttpException {
  constructor(tempToken: string) {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: '2FA verification required',
        error: 'TwoFactorRequired',
        temp_token: tempToken,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class InvalidOtpException extends AuthenticationException {
  constructor(message = 'Invalid or expired OTP') {
    super(message);
  }
}

export class SessionExpiredException extends HttpException {
  constructor(message = 'Session has expired') {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message,
        error: 'SessionExpired',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class DeviceNotTrustedException extends HttpException {
  constructor(message = 'Device is not trusted') {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message,
        error: 'DeviceNotTrusted',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class RateLimitException extends HttpException {
  constructor(message = 'Too many attempts. Please try again later') {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message,
        error: 'RateLimitExceeded',
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
