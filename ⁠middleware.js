// middleware.js - نظام الحماية الشامل والصارم للموقع

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

                    authorized: false, 
                    status: 403, 
                    error: "ACCESS_DENIED", 
                    message: "وصول مرفوض: هذه المنطقة مخصصة للمشرف فقط." 
                };
            }
            // إعادة توجيه غير المشرف فوراً خارج لوحة التحكم
            return { authorized: false, redirectUrl: '/dashboard?error=admin_unauthorized' };
        }
    }

    // 3. حماية قاطعة للمحتوى والأيقونات: منع غير المشتركين وتوجيههم لصفحة الاشتراك
    const userSubscription = user.subscriptionStatus; // active, trialing, expired, null
    const validSubscriptions = ['active', 'trialing'];

    // المشرف مستثنى دائماً، أما غير المشترك فيتم منعه وتوجيهه للاشتراك
    if (user.role !== 'admin' && !validSubscriptions.includes(userSubscription)) {
        if (pathname.startsWith('/api/')) {
            return { 
                authorized: false, 
                status: 402, 
                error: "SUBSCRIPTION_REQUIRED", 
                message: "هذا المحتوى يتطلب اشتراكاً نشطاً. يرجى الاشتراك للاستفادة من خدمات التطبيق." 
            };
        }
        // توجيه قسري لصفحة الاشتراك
        return { authorized: false, redirectUrl: '/subscription?message=upgrade_required' };
    }

    return { authorized: true };
}

