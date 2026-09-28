import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  // حماية لوحة المشرف والتأكد من المسار
  if (url.pathname.startsWith('/admin')) {
    // التحقق من البريد الإلكتروني المحفوظ في الكوكي (Cookie)
    const userEmail = request.cookies.get('userEmail')?.value || '';
    
    // إذا لم يكن البريد مطابقاً للمشرف الحصري، يتم طرده فوراً إلى الصفحة الرئيسية
    if (userEmail !== 'kmskms653@gmail.com') {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};


