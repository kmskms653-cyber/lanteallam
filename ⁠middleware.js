// middleware/auth.js - منع قاطع وحماية شاملة

function strictAuthAndSubscription(req, res, next) {
    const path = req.path;

    // 1. حماية لوحة التحكم (Admin): منع قاطع لأي شخص ما لم يكن المشرف (Admin)
    if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
        if (!req.user || req.user.role !== 'admin') {
            if (path.startsWith('/api/')) {
                return res.status(403).json({
                    error: "FORBIDDEN",
                    message: "غير مسموح لك نهائياً بالوصول لوحة الإدارة"
                });
            }
            // إعادة توجيه فورية لمنع رؤية الرابط أو الصفحة
            return res.redirect('/login?error=admin_required');
        }
    }

    // 2. استثناء الصفحات العامة المسموحة للزوار (تسجيل الدخول، الاشتراكات، الصفحة الرئيسية التعريفية)
    const publicPaths = ['/login', '/register', '/subscription', '/api/login', '/api/register'];
    if (publicPaths.includes(path) || path === '/') {
        return next();
    }

    // 3. منع قاطع للزوار (غير المسجلين أو غير المشتركين) من النقر على أي أيقونة أو محتوى تعليمي
    if (!req.user) {
        if (path.startsWith('/api/')) {
            return res.status(401).json({
                error: "LOGIN_REQUIRED",
                message: "يجب تسجيل الدخول أولاً للاستفادة من المحتوى"
            });
        }
        // تحويل الزائر مباشرة لصفحة تسجيل الدخول أو الاشتراك
        return res.redirect('/login?redirect=' + encodeURIComponent(path));
    }

    // 4. التحقق من الاشتراك النشط للمحتويات والأيقونات المدفوعة (active أو trialing فقط)
    const validStatuses = ['active', 'trialing'];
    if (req.user.role !== 'admin' && !validStatuses.includes(req.user.subscriptionStatus)) {
        if (path.startsWith('/api/')) {
            return res.status(402).json({
                error: "SUBSCRIPTION_REQUIRED",
                message: "هذا المحتوى يتطلب اشتراكاً نشطاً. يرجى الترقية للاستفادة من الأيقونات والدروس."
            });
        }
        // تحويل المستخدم غير المشترك مباشرة لصفحة الاشتراكات
        return res.redirect('/subscription?message=upgrade_required');
    }

    next();
}

module.exports = { strictAuthAndSubscription };
// middleware.js - حماية قاطعة وتوجيه غير المشتركين

export function enforceSubscriptionAndAdmin(req) {
    const { pathname } = req.nextUrl || req.url;

    // 1. استثناء الصفحات العامة التي يجب أن يزورها المستخدم غير المشترك أو الزائر
    const publicPaths = ['/login', '/register', '/subscription', '/api/login', '/api/register', '/'];
    if (publicPaths.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/static')) {
        return { authorized: true };
    }

    // 2. حماية لوحة إدارة المشرف (Admin) منع قاطع لغير المشرف
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        const userRole = req.user?.role; // يتم جلبها من التوكن أو الجلسة
        if (userRole !== 'admin') {
            return {
                authorized: false,
                redirectUrl: '/dashboard?error=unauthorized_admin'
            };
        }
    }

    // 3. منع قاطع لغير المشتركين من الدخول لأي قسم أو أيقونة تعليمية وتوجيههم للاشتراك
    const userSubscription = req.user?.subscriptionStatus; // active, trialing, expired, null
    const validSubscriptions = ['active', 'trialing'];

    if (!validSubscriptions.includes(userSubscription)) {
        return {
            authorized: false,
            redirectUrl: '/subscription?message=subscription_required_to_access_content'
        };
    }

    return { authorized: true };
}
