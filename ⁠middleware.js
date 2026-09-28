// middleware.js - نظام الحماية الشامل والصارم للموقع

export function middleware(req) {
    const pathname = req.nextUrl ? req.nextUrl.pathname : req.url;
    const user = req.user || {}; // جلب بيانات المستخدم

    // 1. استثناء الصفحات العامة والأساسية المسموحة للجميع
    const publicPaths = ['/login', '/register', '/subscription', '/api/login', '/api/register', '/'];
    if (publicPaths.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/static')) {
        return { authorized: true };
    }

    // 2. حماية لوحة إدارة المشرف وإعداداته (حجب تام عن الجميع باستثناء المشرف حصرياً)
    const isAdminRoute = pathname.startsWith('/admin') || 
                           pathname.startsWith('/api/admin') || 
                           pathname.includes('/admin-settings');

    if (isAdminRoute) {
        if (user.role !== 'admin') {
            if (pathname.startsWith('/api/')) {
                return { 
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

