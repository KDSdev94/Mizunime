import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const response = NextResponse.next();

    // Content-Security-Policy - Blocks popups and restricts embedded content
    const csp = [
        "default-src 'self' * data: blob: 'unsafe-inline' 'unsafe-eval'",
        "connect-src 'self' *",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' *",
        "img-src 'self' * data: blob:",
        "frame-src 'self' *",
        "style-src 'self' 'unsafe-inline' *",
        "child-src 'self' *",
        "worker-src 'self' blob:",
        "block-all-mixed-content",
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);

    // Permissions-Policy - Disable unwanted browser features
    const permissions = [
        'accelerometer=()',
        'autoplay=(self)',
        'camera=()',
        'display-capture=()',
        'encrypted-media=()',
        'fullscreen=(self)',
        'geolocation=()',
        'gyroscope=()',
        'magnetometer=()',
        'microphone=()',
        'midi=()',
        'payment=()',
        'picture-in-picture=(self)',
        'screen-wake-lock=()',
        'usb=()',
        'web-share=(self)',
    ].join(', ');

    response.headers.set('Permissions-Policy', permissions);

    // Additional security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
