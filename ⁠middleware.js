import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  // حماية لوحة المشرف
  if (url.pathname.startsWith('/admin')) {
    // التحقق من كوكي أو جلسة المشرف (يمكن تعديلها حسب نظام المصادقة لديك)
    const userEmail = request.cookies.get('userEmail')?.value || '';
    
    if (userEmail !== 'kmskms653@gmail.com') {
      // إعادة توجيه غير المشرف فوراً للرئيسية
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
